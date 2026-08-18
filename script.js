let currentStep = 1;

// Navegación por pasos
function goToStep(step) {
    if (step < 1 || step > 4) return;
    
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelectorAll('.step-link')[currentStep - 1].classList.remove('active');

    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelectorAll('.step-link')[currentStep - 1].classList.add('active');

    document.getElementById('btnPrev').disabled = (currentStep === 1);
    
    if (currentStep === 4) {
        document.getElementById('btnNext').style.display = 'none';
        document.getElementById('btnDownload').style.display = 'inline-flex';
        generateXML();
    } else {
        document.getElementById('btnNext').style.display = 'inline-flex';
        document.getElementById('btnDownload').style.display = 'none';
    }
}

function changeStep(delta) {
    goToStep(currentStep + delta);
}

// Función para alternar visibilidad de contraseña
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    const eyeOpen = `<svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeOff = `<svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

    btn.innerHTML = isPassword ? eyeOff : eyeOpen;
}

// Auxiliares de lectura
function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

function getCheck(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
}

// Visibilidad condicional
document.getElementById('hotlineEnabled').addEventListener('change', function() {
    document.getElementById('hotlineFields').style.display = this.checked ? 'block' : 'none';
    generateXML();
});

function toggleVisibility(checkboxId, containerId) {
    const checkbox = document.getElementById(checkboxId);
    const container = document.getElementById(containerId);
    if (checkbox && container) {
        checkbox.addEventListener('change', function() {
            container.style.display = this.checked ? 'block' : 'none';
            generateXML();
        });
    }
}

toggleVisibility('speedDial1Enabled', 'speedDial1Fields');
toggleVisibility('speedDial2Enabled', 'speedDial2Fields');

document.getElementById('line1Enabled').addEventListener('change', function() {
    document.getElementById('line1Fields').style.display = this.checked ? 'block' : 'none';
    generateXML();
});

document.getElementById('line2Enabled').addEventListener('change', function() {
    document.getElementById('line2Fields').style.display = this.checked ? 'block' : 'none';
    generateXML();
});

// Generación XML
function generateXML() {
    const mac = getVal('macAddress');
    const timeZone = getVal('timeZone');
    const ntpServer = getVal('ntpServer');
    const sipServer = getVal('sipServer');
    const sipPort = getVal('sipPort');
    const registerExpires = getVal('registerExpires');

    const line1Enabled = getCheck('line1Enabled');
    const line1DisplayName = getVal('line1DisplayName');
    const line1Extension = getVal('line1Extension');
    const line1AuthName = getVal('line1AuthName');
    const line1Password = getVal('line1Password');

    const line2Enabled = getCheck('line2Enabled');
    const line2DisplayName = getVal('line2DisplayName');
    const line2Extension = getVal('line2Extension');
    const line2AuthName = getVal('line2AuthName');
    const line2Password = getVal('line2Password');

    const hotlineEnabled = getCheck('hotlineEnabled');
    const hotlineNumber = getVal('hotlineNumber');

    const speedDial1Enabled = getCheck('speedDial1Enabled');
    const speedDial1Number = getVal('speedDial1Number');
    const speedDial1Monitor = getVal('speedDial1Monitor');

    const speedDial2Enabled = getCheck('speedDial2Enabled');
    const speedDial2Number = getVal('speedDial2Number');
    const speedDial2Monitor = getVal('speedDial2Monitor');

    const webAccess = getCheck('webAccess');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<device>
    <fullConfig>true</fullConfig>
    <deviceProtocol>SIP</deviceProtocol>

    <devicePool>
        <dateTimeSetting>
            <dateTemplate>D-M-Ya</dateTemplate>
            <timeZone>${timeZone}</timeZone>
            <ntps>
                <ntp>
                    <name>${ntpServer}</name>
                    <ntpMode>Unicast</ntpMode>
                </ntp>
            </ntps>
        </dateTimeSetting>
        <callManagerGroup>
            <members>
                <member priority="0">
                    <callManager>
                        <processNodeName>${sipServer}</processNodeName>
                        <ports>
                            <sipPort>${sipPort}</sipPort>
                        </ports>
                    </callManager>
                </member>
            </members>
        </callManagerGroup>
    </devicePool>

    <userLocale>
        <name>Español_Venezuela</name>
        <langCode>es_VE</langCode>
        <winCharSet>utf-8</winCharSet>
    </userLocale>
    <networkLocale>Venezuela</networkLocale>`;

    if (line1Enabled) {
        xml += `
    <line>
        <featureID>1</featureID>
        <displayName>${line1DisplayName}</displayName>
        <directoryURI>${line1Extension}</directoryURI>
        <authenticationName>${line1AuthName}</authenticationName>
        <authenticationPassword>${line1Password}</authenticationPassword>
        <proxy>${sipServer}</proxy>
        <sipProfile>
            <timerRegisterExpires>${registerExpires}</timerRegisterExpires>
        </sipProfile>`;

        if (hotlineEnabled) {
            xml += `
        <dialTemplate>
            <dialTemplateEntry>
                <template>^.*$</template>
                <timeout>0</timeout>
                <user>${hotlineNumber}</user>
            </dialTemplateEntry>
        </dialTemplate>`;
        }

        xml += `
    </line>`;
    }

    if (line2Enabled) {
        xml += `
    <line>
        <featureID>2</featureID>
        <displayName>${line2DisplayName}</displayName>
        <directoryURI>${line2Extension}</directoryURI>
        <authenticationName>${line2AuthName}</authenticationName>
        <authenticationPassword>${line2Password}</authenticationPassword>
        <proxy>${sipServer}</proxy>
        <sipProfile>
            <timerRegisterExpires>${registerExpires}</timerRegisterExpires>
        </sipProfile>
    </line>`;
    }

    if (speedDial1Enabled || speedDial2Enabled) {
        xml += `
    <extendedFunction>`;
        
        if (speedDial1Enabled) {
            xml += `
        fnc=sd+blf;sub=${speedDial1Monitor}@${sipServer};ext=${speedDial1Number}@${sipServer};`;
        }
        
        if (speedDial2Enabled) {
            xml += `
        fnc=sd+blf;sub=${speedDial2Monitor}@${sipServer};ext=${speedDial2Number}@${sipServer};`;
        }
        
        xml += `
    </extendedFunction>`;
    }

    xml += `
    <vendorConfig>
        <webAccess>${webAccess ? '1' : '0'}</webAccess>
    </vendorConfig>
</device>`;

    document.getElementById('xmlPreview').textContent = xml;
    document.getElementById('fileNameDisplay').textContent = `SEP${mac}.cnf.xml`;
}

function downloadXML() {
    const xml = document.getElementById('xmlPreview').textContent;
    const mac = getVal('macAddress');
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SEP${mac}.cnf.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', generateXML);
    input.addEventListener('change', generateXML);
});

generateXML();