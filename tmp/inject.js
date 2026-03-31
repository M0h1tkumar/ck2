const fs = require('fs');
const path = require('path');

const contactBlock = `
<!-- CONTACT BLOCK START -->
<section class="contact-block" style="margin: 2rem auto; padding: 1.5rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); width: 100%; max-width: 600px;">
    <h3 style="color: #fff; font-size: 1.1rem; margin-bottom: 1.2rem; text-transform: uppercase; letter-spacing: 1px;">Chakravyuh Genesis 2026 Official Contacts</h3>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
            <div style="color: rgba(255,255,255,0.85); font-weight: 500; font-size: 0.95rem;">Mr. Subinay Das</div>
            <a href="tel:+917008539718" style="color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; transition: color 0.3s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">+91 7008539718</a>
        </div>
        <div>
            <div style="color: rgba(255,255,255,0.85); font-weight: 500; font-size: 0.95rem;">Mr. P Sai Krishna</div>
            <a href="tel:+917205433228" style="color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; transition: color 0.3s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">+91 7205433228</a>
        </div>
    </div>
</section>
<!-- CONTACT BLOCK END -->
`;

function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('Chakravyuh Genesis 2026 Official Contacts')) return;
    
    // Find <div class="scroll-body">
    const scrollStr = '<div class="scroll-body">';
    let startIdx = content.indexOf(scrollStr);
    if (startIdx === -1) return; // not a scrollable page (e.g. 3d hub)
    
    startIdx += scrollStr.length;
    let depth = 1;
    let i = startIdx;
    
    // trace divs to find the matching closing div for scroll-body
    while (i < content.length) {
        if (content.substring(i, i + 4) === '<div') {
            depth++;
            i += 4;
        } else if (content.substring(i, i + 6) === '</div>') {
            depth--;
            if (depth === 0) {
                // found the closing div
                let newContent = content.substring(0, i) + contactBlock + content.substring(i);
                fs.writeFileSync(filePath, newContent);
                console.log('Appended to', filePath);
                return;
            }
            i += 6;
        } else {
            i++;
        }
    }
}

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== '3d') {
                walk(fullPath);
            }
        } else if (file.endsWith('.html')) {
            processHtmlFile(fullPath);
        }
    });
}

walk(path.join(process.cwd(), 'public'));
