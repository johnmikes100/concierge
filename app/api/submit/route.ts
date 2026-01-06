// import { Resend } from "resend"
// import { NextResponse } from "next/server"

// export async function POST(request: Request) {
//   try {
//     const resend = new Resend(process.env.RESEND_API_KEY)
//     const data = await request.json()

//     const formatDate = (dateValue: string) => {
//       if (dateValue === "not-sure-yet") return "Not sure yet"
//       try {
//         const date = new Date(dateValue + "T00:00:00")
//         return date.toLocaleDateString("en-US", {
//           weekday: "long",
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         })
//       } catch {
//         return dateValue
//       }
//     }

//     // Send notification email to you with all answers
//     await resend.emails.send({
//       from: "Concierge <onboarding@resend.dev>",
//       to: "sfhappyhourhelp@gmail.com",
//       subject: `New Concierge Request from ${data.fullName} at ${data.companyName}`,
//       html: `
//         <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <h1 style="font-size: 24px; color: #111; margin-bottom: 24px;">New Event Request</h1>
          
//           <div style="margin-bottom: 20px;">
//             <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Full name</p>
//             <p style="font-size: 16px; color: #111; margin: 0;">${data.fullName}</p>
//           </div>
          
//           <div style="margin-bottom: 20px;">
//             <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Phone number</p>
//             <p style="font-size: 16px; color: #111; margin: 0;">${data.phoneNumber}</p>
//           </div>
          
//           <div style="margin-bottom: 20px;">
//             <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Email address</p>
//             <p style="font-size: 16px; color: #111; margin: 0;">${data.email}</p>
//           </div>
          
//           <div style="margin-bottom: 20px;">
//             <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">What is the name of your company?</p>
//             <p style="font-size: 16px; color: #111; margin: 0;">${data.companyName}</p>
//           </div>
          
//           <div style="margin-bottom: 20px;">
//             <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">What's the occasion?</p>
//             <p style="font-size: 16px; color: #111; margin: 0;">${data.occasion}</p>
//           </div>
          
//           <div style="margin-bottom: 20px;">
//             <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Roughly how many people are you expecting?</p>
//             <p style="font-size: 16px; color: #111; margin: 0;">${data.peopleCount}</p>
//           </div>
          
//           <div style="margin-bottom: 20px;">
//             <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">What's your preferred date?</p>
//             <p style="font-size: 16px; color: #111; margin: 0;">${formatDate(data.preferredDate)}</p>
//           </div>
          
//           <div style="margin-bottom: 20px;">
//             <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">What is the estimated total budget?</p>
//             <p style="font-size: 16px; color: #111; margin: 0;">${data.budget}</p>
//           </div>
          
//           <div style="margin-bottom: 20px;">
//             <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">What "Vibe" are you looking for?</p>
//             <p style="font-size: 16px; color: #111; margin: 0;">${data.vibe}</p>
//           </div>
          
//           <div style="margin-bottom: 20px;">
//             <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Do you need a private room, or is a reserved "section" okay?</p>
//             <p style="font-size: 16px; color: #111; margin: 0;">${data.roomType}</p>
//           </div>
          
//           <div style="margin-bottom: 20px;">
//             <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Any "Must-Have" amenities?</p>
//             <p style="font-size: 16px; color: #111; margin: 0;">${data.amenities.length > 0 ? data.amenities.join(", ") : "None selected"}</p>
//           </div>
//         </div>
//       `,
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error sending email:", error)
//     return NextResponse.json({ 
//       success: false, 
//       error: error instanceof Error ? error.message : "Failed to send email" 
//     }, { status: 500 })
//   }
// }


import { EmailTemplate } from '../../../components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Concierge <onboarding@resend.dev>',
      to: ['sfhappyhourhelp@gmail.com'],
      subject: 'Test Email - Hello from Concierge!',
      html: '<p>This is a test email. If you received this, the email system is working!</p>',
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error }, { status: 500 });
    }

    console.log('Email sent successfully:', data);
    return Response.json({ data });
  } catch (error) {
    console.error('Catch error:', error);
    return Response.json({ error }, { status: 500 });
  }
}
