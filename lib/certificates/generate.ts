import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export async function generateAndSaveCertificate(courseName: string, userName: string) {
  if (!auth.currentUser) throw new Error("User not logged in");
  
  const uid = auth.currentUser.uid;

  // 1. Create a hidden DOM element for the certificate visual
  const certDiv = document.createElement('div');
  certDiv.style.width = '1122px'; // A4 landscape at 96 DPI
  certDiv.style.height = '793px';
  certDiv.style.position = 'absolute';
  certDiv.style.left = '-9999px';
  certDiv.style.background = 'linear-gradient(135deg, #1A1A1A 0%, #000000 100%)';
  certDiv.style.color = '#FFFFFF';
  certDiv.style.padding = '60px';
  certDiv.style.boxSizing = 'border-box';
  certDiv.style.fontFamily = 'sans-serif';
  certDiv.innerHTML = `
    <div style="border: 4px solid #F5F5F5; height: 100%; border-radius: 20px; padding: 40px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -50%; right: -20%; width: 600px; height: 600px; background: rgba(56, 189, 248, 0.1); border-radius: 50%; filter: blur(50px);"></div>
      <div>
        <h1 style="color: #38bdf8; font-size: 24px; letter-spacing: 4px; margin-bottom: 60px;">KERJAKAMU ACADEMY</h1>
        <h2 style="font-size: 64px; font-weight: 800; margin: 0 0 20px 0;">CERTIFICATE</h2>
        <h3 style="font-size: 24px; font-weight: 400; color: #a1a1aa; margin: 0 0 40px 0;">OF COMPLETION</h3>
      </div>
      
      <div>
        <p style="font-size: 18px; color: #a1a1aa; margin-bottom: 10px;">PROUDLY PRESENTED TO</p>
        <p style="font-size: 48px; font-weight: bold; color: #38bdf8; margin: 0 0 20px 0; border-bottom: 2px solid #333; display: inline-block; padding-bottom: 10px;">${userName}</p>
        <p style="font-size: 18px; color: #a1a1aa; margin-top: 20px; line-height: 1.6; max-w: 600px;">
          For successfully completing the intensive 7-day program:<br/>
          <strong style="color: white; font-size: 24px;">${courseName}</strong>
        </p>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <p style="font-size: 14px; color: #71717a; margin: 0;">Date of Issue</p>
          <p style="font-size: 18px; font-weight: bold; margin: 5px 0 0 0;">${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style="text-align: right;">
          <div style="font-family: 'Brush Script MT', cursive; font-size: 32px; color: #38bdf8; margin-bottom: 10px;">KerjaKamu Team</div>
          <p style="font-size: 14px; color: #71717a; margin: 0; border-top: 1px solid #333; padding-top: 5px;">KerjaKamu Platform Director</p>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(certDiv);

  try {
    // 2. Capture as Image using html2canvas
    const canvas = await html2canvas(certDiv, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    // 3. Create PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1122, 793]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, 1122, 793);
    
    // Save locally to user immediately
    const filename = \`Sertifikat_\${courseName.replace(/\\s+/g, '_')}_\${userName.replace(/\\s+/g, '_')}.pdf\`;
    pdf.save(filename);

    // 4. Upload to Firebase Storage
    const storage = getStorage();
    const certRef = ref(storage, \`certificates/\${uid}/\${Date.now()}.pdf\`);
    const pdfBase64 = pdf.output('datauristring');
    
    // Extract base64 data
    const base64Data = pdfBase64.split(',')[1];
    await uploadString(certRef, base64Data, 'base64', { contentType: 'application/pdf' });
    
    // 5. Get URL and save to Firestore
    const downloadUrl = await getDownloadURL(certRef);
    
    // Save to user subcollection
    await addDoc(collection(db, "users", uid, "certificates"), {
      courseName,
      issuedAt: new Date().toISOString(),
      pdfUrl: downloadUrl
    });

  } catch (error) {
    console.error("Certificate Generation Failed:", error);
    throw error;
  } finally {
    // Cleanup DOM
    document.body.removeChild(certDiv);
  }
}
