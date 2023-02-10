const mongoose = require('mongoose');

//const uri = "mongodb://localhost:27017/shoplin";
const uri = "mongodb+srv://salar:Salar123@cluster0.tgrlg.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
    if(err)
        console.log(err);
});
const db = mongoose.connection;

const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    user: Number,
    level: String
});
SessionSchema.statics.getLevel = async function(ctx){
    return this.findOne({user:ctx.from.id});
} 
SessionSchema.statics.changeLevel = async function(ctx,newLevel){
    await this.updateOne({user:ctx.from.id},{level:newLevel});
}

SessionSchema.statics.new = async function(ctx,level) {
    new Session({
        user:ctx.from.id,
        level:level
    }).save()
};
const Session = mongoose.model('session',SessionSchema);


const ProductSchema = new Schema({
    _id: String,
    user: Number,
    name: String,
    description: String,
    type: Number,
    price: Number,
    photo: String,
    messageId: Number,
    paymentUrl: String,
    date_created: { type: Date, default: Date.now }, 
});
ProductSchema.statics.new = async function(data){
    await new Product(data).save()
}


const Product = mongoose.model('product',ProductSchema);


const TempProductSchema = new Schema({
    user: Number,
    name: String,
    description: String,
    type: String,
    price: String,
    photo: String,
    paymentUrl: String,
});

TempProductSchema.statics.addField = async function(ctx,field){
    await this.updateOne({user:ctx.from.id},field);
} 

TempProductSchema.statics.get = async function(ctx){
    return this.findOne({user:ctx.from.id});
} 
TempProductSchema.statics.new = async function(data){
    new TempProduct(data).save();
} 
TempProductSchema.statics.saveToProducts =async function(ctx, mid){
    try{
        const temp = await this.get(ctx);
        const data = {
            _id: String(temp._id),
            name:String(temp.name),
            description:String(temp.description),
            photo:String(temp.photo),
            type:parseInt(temp.type),
            user:parseInt(temp.user),
            price:parseInt(temp.price),
            messageId: parseInt(mid),
            paymentUrl: String(temp.paymentUrl),
        };
        await Product.new(data);
        await TempProduct.deleteOne({_id:temp._id});
    }catch(error){
        console.log(error);
    }
}

const TempProduct = mongoose.model('temp-product',TempProductSchema);




const Store = new Schema({
    name: String,
    user: Number,
    desc: String,
    supportId: Number,
    
    

})

exports.Session = Session;
exports.Product = Product;
exports.TempProduct = TempProduct;
exports.db = db;