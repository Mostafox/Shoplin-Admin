const mongoose = require('mongoose');

const uri = "mongodb://localhost:27017/shoplin";
//const uri = "mongodb+srv://shoplin:Salar123@cluster0.rchjw.mongodb.net/shoplin?retryWrites=true&w=majority";

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
    user: Number,
    name: String,
    description: String,
    type: Number,
    price: Number,
    photo: String,
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
TempProductSchema.statics.saveToProducts =async function(ctx){
    const temp = await this.get(ctx);
    const data = {
        name:String(temp.name),
        description:String(temp.description),
        photo:String(temp.photo),
        type:parseInt(temp.type),
        user:parseInt(temp.user),
        price:parseInt(temp.price)
    };
    await Product.new(data);
    await TempProduct.deleteOne({_id:temp._id});
}

const TempProduct = mongoose.model('temp-product',TempProductSchema);

const Store = new Schema({
    name: String,
    user: Number,
    gateway: Array,
    

})





exports.Session = Session;
exports.Product = Product;
exports.TempProduct = TempProduct;
exports.db = db;