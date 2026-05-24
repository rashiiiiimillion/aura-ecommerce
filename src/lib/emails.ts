import { resend } from "./resend";

interface OrderEmailProps {
  to: string;
  orderId: string;
  total: number;
  items: any[];
}

export async function sendOrderConfirmationEmail({ to, orderId, total, items }: OrderEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Aura Luxury <orders@aura-luxury.com>", // You'd use a verified domain here
      to,
      subject: `Order Confirmation #${orderId.slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
          <h1 style="font-size: 24px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #eee; padding-bottom: 20px;">Order Confirmed</h1>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 30px 0;">
            Thank you for your order. We are currently preparing your pieces for shipment.
          </p>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9;">
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 5px;">Order Number</p>
            <p style="font-size: 16px; font-weight: 500; margin: 0;">#${orderId.toUpperCase()}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
            <thead>
              <tr style="border-bottom: 1px solid #eee;">
                <th style="text-align: left; padding: 10px 0; font-size: 12px; text-transform: uppercase; color: #999;">Item</th>
                <th style="text-align: right; padding: 10px 0; font-size: 12px; text-transform: uppercase; color: #999;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 15px 0;">
                    <p style="font-size: 14px; font-weight: 500; margin: 0;">${item.product.name}</p>
                    <p style="font-size: 12px; color: #666; margin: 5px 0 0;">Qty: ${item.quantity}</p>
                  </td>
                  <td style="text-align: right; font-size: 14px;">$${Number(item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 20px 0 5px; font-size: 14px; text-transform: uppercase; color: #999;">Total</td>
                <td style="padding: 20px 0 5px; text-align: right; font-size: 18px; font-weight: 600;">$${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
            <p style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Aura Luxury Ecommerce</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email catch error:", error);
    return { success: false, error };
  }
}
