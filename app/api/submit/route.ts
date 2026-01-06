import { Resend } from "resend"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const data = await request.json()

    const formatDate = (dateValue: string) => {
      if (dateValue === "not-sure-yet") return "Not sure yet"
      try {
        const date = new Date(dateValue + "T00:00:00")
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      } catch {
        return dateValue
      }
    }

    // Send confirmation email to the customer
    const customerEmail = await resend.emails.send({
      from: "Happy Hour SF <onboarding@resend.dev>",
      to: data.email,
      subject: "We’re on it, finding the perfect fit for your team’s event",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Hi there,</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Thanks for reaching out. I'm excited to help you find the right venue for your team's event.</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">I'm already pulling together a short list of venues that fit your group size, budget, vibe, and timing. We work directly with great bars and restaurants, so we'll focus on places that are easy to book, team-friendly, and genuinely fun.</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">You can expect a curated set of options shortly. Looking forward to helping you lock something great in.</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Best,</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333; font-weight: 600;">Happy Hour SF</p>
        </div>
      `,
    })

    console.log("Customer email result:", customerEmail)

    // Send notification email to you with all answers
    const adminEmail = await resend.emails.send({
      from: "Concierge <onboarding@resend.dev>",
      to: "sfhappyhourhelp@gmail.com",
      subject: `New Concierge Request from ${data.fullName} at ${data.companyName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="font-size: 24px; color: #111; margin-bottom: 24px;">New Event Request</h1>
          
          <div style="margin-bottom: 20px;">
            <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Full name</p>
            <p style="font-size: 16px; color: #111; margin: 0;">${data.fullName}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Email address</p>
            <p style="font-size: 16px; color: #111; margin: 0;">${data.email}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">What is the name of your company?</p>
            <p style="font-size: 16px; color: #111; margin: 0;">${data.companyName}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">What's the occasion?</p>
            <p style="font-size: 16px; color: #111; margin: 0;">${data.occasion}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Roughly how many people are you expecting?</p>
            <p style="font-size: 16px; color: #111; margin: 0;">${data.peopleCount}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">What's your preferred date?</p>
            <p style="font-size: 16px; color: #111; margin: 0;">${formatDate(data.preferredDate)}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">What is the estimated total budget?</p>
            <p style="font-size: 16px; color: #111; margin: 0;">${data.budget}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">What "Vibe" are you looking for?</p>
            <p style="font-size: 16px; color: #111; margin: 0;">${data.vibe}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Do you need a private room, or is a reserved "section" okay?</p>
            <p style="font-size: 16px; color: #111; margin: 0;">${data.roomType}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="font-size: 14px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Any "Must-Have" amenities?</p>
            <p style="font-size: 16px; color: #111; margin: 0;">${data.amenities.length > 0 ? data.amenities.join(", ") : "None selected"}</p>
          </div>
        </div>
      `,
    })

    console.log("Admin email result:", adminEmail)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending emails:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to send emails" 
    }, { status: 500 })
  }
}