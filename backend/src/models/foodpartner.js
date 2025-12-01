import mongoose from "mongoose";

const foodPartnerSchema = new mongoose.Schema({
    businessName : {
        type: String,
        required:true
    },

    contactName:{
        type: String,
        required:true
        
    },
    
    phone:{
    type: String,
    required:true
},
    email: {
        type : String,
        required : true,
        unique : true
    },

    password :{
        type: String,
        required: true
    }

})

const foodPartnerModel = mongoose.model("foodPartner", foodPartnerSchema)

export default foodPartnerModel;