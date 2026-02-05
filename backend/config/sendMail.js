import { createTransport } from "nodemailer";
import { success } from "zod";

export async function sendMail({to,subject,text,html}) {
  try{
    const transporter=createTransport({
      host:process.env.EMAIL_HOST,
      port:process.env.EMAIL_PORT,
      secure:false,
      auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
      }
    })
    const mailOptions={
      from:`"My App" <${process.env.EMAIL_USER}>`,
      to,
      subject,text,html,
    }

    const info=await transporter.sendMail(mailOptions);

    return{
      success:true,
      messageId:info.messageId,
    }
  }catch(error){
    console.error("EMAIL sending failed",error);
    return{
      success:false,
      error:error.message,
    }
  }
  }