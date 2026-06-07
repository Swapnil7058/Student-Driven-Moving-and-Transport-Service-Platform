import ContactSupport from "../models/contact.model.js";


export const createSupport = async (req, res)=>{
    try{
        const {name, email, message}= req.body;

        if(!name || !email || !message){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }


        const support = await ContactSupport.create({
            name,email,message
        });

        res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data: support
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to send message"   
        });
    }
};

export const getSupportDetails = async (req, res) => {
    res.json({
        success: true,
        data: {
            companyName: process.env.SUPPORT_COMPANY_NAME || "Van Man Packers & Movers",
            address:
                process.env.SUPPORT_ADDRESS ||
                "Student Innovation Hub, Main City Road, Pune, Maharashtra, India",
            phone: process.env.SUPPORT_PHONE || "+91 98765 43210",
            email: process.env.SUPPORT_EMAIL || "support@vanman.example",
            mapLink: process.env.SUPPORT_MAP_EMBED || "",
        },
    });
};
