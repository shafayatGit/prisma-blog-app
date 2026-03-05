import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // console.log({user,url,token})
      try {
        const verificationURL = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog App" <prismaltd@gmail.com>',
          to: user.email,
          subject: "Verify your email - Prisma Blog App",
          html: `
  <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:40px 0;">
    <table align="center" width="600" style="background:#ffffff; border-radius:8px; padding:30px;">
      
      <tr>
        <td style="text-align:center;">
          <h2 style="color:#333;">Prisma Blog App</h2>
          <p style="color:#666;">Verify your email address</p>
        </td>
      </tr>

      <tr>
        <td style="padding:20px 0; color:#444; font-size:15px;">
          Hello ${user.name},<br/><br/>
          Thank you for creating an account on <b>Prisma Blog App</b>.  
          Please click the button below to verify your email address.
        </td>
      </tr>

      <tr>
        <td align="center">
          <a href="${verificationURL}" 
             style="
               display:inline-block;
               padding:12px 25px;
               background:#4CAF50;
               color:#ffffff;
               text-decoration:none;
               border-radius:5px;
               font-weight:bold;
             ">
             Verify Email
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding-top:25px; color:#888; font-size:13px;">
          If the button doesn't work, copy and paste this link into your browser:
          <br/>
          <a href="${verificationURL}" style="color:#4CAF50;">${verificationURL}</a>
        </td>
      </tr>

      <tr>
        <td style="padding-top:30px; font-size:12px; color:#aaa; text-align:center;">
          © ${new Date().getFullYear()} Prisma Blog App. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `,
        });
        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
});
