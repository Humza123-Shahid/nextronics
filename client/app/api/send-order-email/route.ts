import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { to, subject, html } = await request.json();
        // const urlRegex = /http:\/\/127\.0\.0\.1:8080\/media\/[^"'\s>]+/g;
        // const matches = Array.from(new Set(html.match(urlRegex) || [])) as string[];

        // let processedHtml = html;
        // const attachments: any[] = [];

        // // Fetch each local image on the server and attach via CID
        // for (let i = 0; i < matches.length; i++) {
        //     const localUrl = matches[i];
        //     const cid = `product_img_${i}@order`;

        //     const imgRes = await fetch(localUrl);
        //     if (imgRes.ok) {
        //         const arrayBuffer = await imgRes.arrayBuffer();
        //         const buffer = Buffer.from(arrayBuffer);
        //         const filename = localUrl.split('/').pop() || `image_${i}.png`;

        //         attachments.push({
        //             filename,
        //             content: buffer,
        //             cid, // Referenced in HTML as src="cid:product_img_0@order"
        //         });

        //         processedHtml = processedHtml.replaceAll(localUrl, `cid:${cid}`);
        //     }
        // }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "humzashahid2068@gmail.com",
                pass: "waqc dkqq kvrq rbxe",
            }
        });

        await transporter.sendMail({
            from: `"Humza Shahid" <humzashahid2068@gmail.com>`,
            to,
            subject,
            html,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to send email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
