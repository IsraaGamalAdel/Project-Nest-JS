import { FilterQuery, Model, PopulateOptions, UpdateQuery, UpdateWriteOpResult } from 'mongoose';


export interface IPaginate<T> {
    count: number,
    pageSize: number,
    pages: number,
    page: number,
    documents: T[] | []
}



export abstract class DatabaseRepository<TDocument> {
    protected constructor( protected readonly model: Model<TDocument>){}

    async find({
        filter,
        select, 
        sort, 
        page = 0,
        populate
    }: {
        filter?: FilterQuery<TDocument>;
        select?: string;
        sort?: string;
        page?: number;
        populate?: PopulateOptions[];
    }): Promise<TDocument[]| [] | IPaginate<TDocument> > {

        let query = this.model.find(filter || {});

        if(select){
            select = select.replaceAll(',' , ' ');
            query.select(select);
        }
        if(sort){
            sort = sort.replaceAll(',' , ' ');
            query.sort(sort);
        }
        if(populate){
            query.populate(populate);
        }

        if(!page) {
            return await query.exec();
        }

        const limit = 10;
        const skip = (page - 1) * limit;
        const count = await this.model.countDocuments(filter || {});

        const pages = Math.ceil(count / limit);
        const documents = await query.skip(skip).limit(limit).exec();
        return{
            count,
            pageSize: limit,
            pages,
            page,
            documents
        }
    }

    async findOne({
        filter , 
        populate,
    } : {
        filter?: FilterQuery<TDocument>,
        populate?: PopulateOptions[]
    }): Promise<TDocument | null> {
        return await this.model.findOne(filter || {}).populate(populate || []);
    }


    async updateOne({
        filter , 
        data,
    } : {
        filter: FilterQuery<TDocument>,
        data: UpdateQuery<TDocument>,
    }): Promise<UpdateWriteOpResult> {
        return await this.model.updateOne(filter , data);
    }


    
    // Edit
    async update({
        filter , 
        data,
        // select,
        // populate
    } : {
        filter: FilterQuery<TDocument>,
        data: UpdateQuery<TDocument>,
        // select: 
        
    }): Promise<TDocument | null> {
        let query = this.model.findOneAndUpdate( filter , data , {
            new: true,
            runValidators: true
        })

        // if(select) query = query.select(select)

        // if(populate) query = query.populate(populate)

        return query.exec();
    }



    async create(data: Partial<TDocument>) : Promise<TDocument> {
        return await this.model.create(data);
    }


    // async findOneAndUpdate({
    //     filter , 
    //     data,
    // } : {
    //     filter: FilterQuery<TDocument>,
    //     data: UpdateQuery<TDocument>,
    // }): Promise<TDocument | null> {
    //     return await this.model.findOneAndUpdate(filter , data , {new: true});
    // }

    async findOneAndUpdate({
        filter, 
        data,
    }: {
        filter: FilterQuery<TDocument>,
        data: UpdateQuery<TDocument>,
    }): Promise<TDocument> {
        const result = await this.model.findOneAndUpdate(filter, data, {new: true});
        if (!result) {
            throw new Error("Document not found");
        }
        return result;
    }


    async deleteOne({
        filter
    }: {
        filter: FilterQuery<TDocument>
    }): Promise<{ deletedCount: number }> {
        const result = await this.model.deleteOne(filter);
        
        if (result.deletedCount === 0) {
            throw new Error("Document not found");
        }
        return { deletedCount: result.deletedCount };
    }


    async findByIdAndDelete({
        filter,
        data
    }: {
        filter: FilterQuery<TDocument>,
        data: UpdateQuery<TDocument>,
    }): Promise<TDocument> {
        const deletedId = await this.model.findByIdAndDelete(filter , data);
        if (!deletedId) {
            throw new Error("Document not found");
        }
        return deletedId;
    }


    async findOneAndDelete({
        filter
    }: {
        filter: FilterQuery<TDocument>
    }): Promise<TDocument> {
        const deletedDoc = await this.model.findOneAndDelete(filter);
        if (!deletedDoc) {
            throw new Error("Document not found");
        }
        return deletedDoc;
    }
}

