import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { log } from 'console';
import { Request } from 'express';
import { OrderDocument } from 'src/DB/model/Order.model';
import { OrderRepositoryService } from 'src/DB/repository/Order.repository.service';
import { OrderStatus } from 'src/modules/order/order.interface';
import Stripe from 'stripe';




@Injectable()
export class PaymentService {
    private stripe: Stripe;

    constructor(
        private readonly orderRepositoryService: OrderRepositoryService<OrderDocument>
    ){
        this.stripe = new Stripe(process.env.STRIPE_SECRET as string);
    }

    async checkoutSession({
            customer_email,
            mode='payment',
            cancel_url=process.env.CANCEL_URL,
            success_url=process.env.SUCCESS_URL,
            metadata={},
            line_items,
            discounts=[]

    }: Stripe.Checkout.SessionCreateParams) : Promise< Stripe.Response<Stripe.Checkout.Session> >{
        const session = await this.stripe.checkout.sessions.create({
            customer_email,
            mode,
            cancel_url,
            success_url,
            metadata,
            line_items,
            discounts
        })

        return session;
    }


    async createCoupon (
        params: Stripe.CouponCreateParams
    ) : Promise<Stripe.Response<Stripe.Coupon>>{
        const coupon = await this.stripe.coupons.create(params)

        return coupon;
    }


    async webhook ( req: Request ){
        
        let body = req.body;
        // log({body})
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
        const signature = req.headers['stripe-signature'];

        const event = this.stripe.webhooks.constructEvent(
            body,
            signature as string,
            endpointSecret as string
        );
        
        log({event: event.data.object['metadata'].orderId});

        const orderId = event.data.object['metadata'].orderId;

        if (event.type != 'checkout.session.completed') {
            throw new BadRequestException('Invalid event type to payment');
        }

        const order = await this.orderRepositoryService.findOne({
            filter: {
                _id: orderId,
                status: OrderStatus.pending
            }
        })
        if(!order?.intentId){
            throw new NotFoundException('Order not found')
        }

        await this.confirmPaymentIntent(order.intentId)

        await this.orderRepositoryService.updateOne({
            filter: {
                _id: orderId,
                status: OrderStatus.pending
            },
            data: {
                status: OrderStatus.placed,
                paidAt: Date.now()
            }
        });

        return'done'
    }


    async createPaymentIntent(
        amount: number,
        currency: string = 'egp'
    ) : Promise<Stripe.Response<Stripe.PaymentIntent>> {
        const paymentMethod = await this.createPaymentMethod();
        // log({paymentMethod});
        const intent = await this.stripe.paymentIntents.create({
            amount: amount * 100,
            currency,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            },
            payment_method: paymentMethod.id 
        })

        // log({intent});
        return intent;
    }


    async createPaymentMethod(
        token: string = 'tok_visa'
    ) : Promise<Stripe.Response<Stripe.PaymentMethod>> {
        const paymentMethod = await this.stripe.paymentMethods.create({
            type: 'card',
            card: {
                token,
            }
        })

        return paymentMethod;
    }


    async retrievePaymentIntent(
        id: string,
    ) : Promise<Stripe.Response<Stripe.PaymentIntent>> {
        const retrievePaymentIntent = await this.stripe.paymentIntents.retrieve(id);
        
        return retrievePaymentIntent;
    }


    async confirmPaymentIntent(
        id: string
    ) : Promise<Stripe.Response<Stripe.PaymentIntent>>{
        const  intent = await this.retrievePaymentIntent(id);
        if(!intent){
            throw new BadRequestException('Payment intent not found');
        }

        const paymentIntent = await this.stripe.paymentIntents.confirm(
            intent.id,
            {
                payment_method: 'pm_card_visa',
            }
        );

        log({paymentIntent});

        if(paymentIntent.status != 'succeeded'){
            throw new BadRequestException('Payment intent confirmation not succeeded');
        }

        return paymentIntent;
    }


    async refund(
        id: string,
    ) : Promise<Stripe.Response<Stripe.Refund>>{
        const refund = await this.stripe.refunds.create({
            payment_intent: id
        })

        return refund;
    }
}

