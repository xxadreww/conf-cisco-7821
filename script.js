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

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    const eyeOpen = `<svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeOff = `<svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

    btn.innerHTML = isPassword ? eyeOff : eyeOpen;
}

// Sanitización: Permite letras, números, puntos, guiones, barras, espacios y slash
function sanitizeInput(value) {
    // Permite: letras (con acentos), números, espacios, puntos, guiones, barras, arroba, slash
    return value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.\-/@]/g, '');
}

function getVal(id) {
    const el = document.getElementById(id);
    if (!el) return '';
    return el.value;
}

function getCheck(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
}

// Visibilidad condicional - LÍNEA 1 siempre visible
document.getElementById('line1Enabled').addEventListener('change', function() {
    document.getElementById('line1Fields').style.display = this.checked ? 'block' : 'none';
    if (currentStep === 4) generateXML();
});

// Visibilidad condicional - LÍNEA 2 siempre visible
document.getElementById('line2Enabled').addEventListener('change', function() {
    document.getElementById('line2Fields').style.display = this.checked ? 'block' : 'none';
    if (currentStep === 4) generateXML();
});

// Visibilidad condicional - HOTLINE
document.getElementById('hotlineEnabled').addEventListener('change', function() {
    document.getElementById('hotlineFields').style.display = this.checked ? 'block' : 'none';
    if (currentStep === 4) generateXML();
});

// GENERACIÓN XML
function generateXML() {
    const mac = getVal('macAddress');
    const timeZone = getVal('timeZone');
    const ntpServer = getVal('ntpServer');
    const sipServer = getVal('sipServer');
    const sipPort = getVal('sipPort');
    const registerExpires = getVal('registerExpires');
    const phoneLabel = getVal('phoneLabel');
    const sshUser = getVal('sshUser');
    const sshPass = getVal('sshPass');
    const directoryURL = getVal('directoryURL');

    const line1Enabled = getCheck('line1Enabled');
    const line1DisplayName = getVal('line1DisplayName');
    const line1Extension = getVal('line1Extension');
    const line1AuthName = getVal('line1AuthName');
    const line1Password = getVal('line1Password');
    const line1Contact = getVal('line1Contact');

    const line2Enabled = getCheck('line2Enabled');
    const line2DisplayName = getVal('line2DisplayName');
    const line2Extension = getVal('line2Extension');
    const line2AuthName = getVal('line2AuthName');
    const line2Password = getVal('line2Password');
    const line2Contact = getVal('line2Contact');

    const hotlineEnabled = getCheck('hotlineEnabled');
    const hotlineNumber = getVal('hotlineNumber');

    const webAccess = getCheck('webAccess');

    let xml = `<device>
   <deviceProtocol>SIP</deviceProtocol>
   <sshUserId>${sshUser}</sshUserId>
   <sshPassword>${sshPass}</sshPassword>
   <devicePool>
      <dateTimeSetting>
         <dateTemplate>D/M/YY</dateTemplate>
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
                  <ports>
                     <ethernetPhonePort>2000</ethernetPhonePort>
                     <sipPort>${sipPort}</sipPort>
                     <securedSipPort>5061</securedSipPort>
                  </ports>
                  <processNodeName>${sipServer}</processNodeName>
               </callManager>
            </member>
         </members>
      </callManagerGroup>
   </devicePool>
   <sipProfile>
      <sipProxies>
         <backupProxy></backupProxy>
         <backupProxyPort>5060</backupProxyPort>
         <emergencyProxy></emergencyProxy>
         <emergencyProxyPort></emergencyProxyPort>
         <outboundProxy></outboundProxy>
         <outboundProxyPort></outboundProxyPort>
         <registerWithProxy>true</registerWithProxy>
      </sipProxies>
      <sipCallFeatures>
         <cnfJoinEnabled>true</cnfJoinEnabled>
         <callForwardURI>x-serviceuri-cfwdall</callForwardURI>
         <callPickupURI>x-cisco-serviceuri-pickup</callPickupURI>
         <callPickupListURI>x-cisco-serviceuri-opickup</callPickupListURI>
         <callPickupGroupURI>x-cisco-serviceuri-gpickup</callPickupGroupURI>
         <meetMeServiceURI>x-cisco-serviceuri-meetme</meetMeServiceURI>
         <abbreviatedDialURI>x-cisco-serviceuri-abbrdial</abbreviatedDialURI>
         <rfc2543Hold>false</rfc2543Hold>
         <callHoldRingback>2</callHoldRingback>
         <localCfwdEnable>true</localCfwdEnable>
         <semiAttendedTransfer>true</semiAttendedTransfer>
         <anonymousCallBlock>2</anonymousCallBlock>
         <callerIdBlocking>2</callerIdBlocking>
         <dndControl>0</dndControl>
         <remoteCcEnable>true</remoteCcEnable>
      </sipCallFeatures>
      <sipStack>
         <sipInviteRetx>6</sipInviteRetx>
         <sipRetx>10</sipRetx>
         <timerInviteExpires>180</timerInviteExpires>
         <timerRegisterExpires>${registerExpires}</timerRegisterExpires>
         <timerRegisterDelta>5</timerRegisterDelta>
         <timerKeepAliveExpires>120</timerKeepAliveExpires>
         <timerSubscribeExpires>120</timerSubscribeExpires>
         <timerSubscribeDelta>5</timerSubscribeDelta>
         <timerT1>500</timerT1>
         <timerT2>4000</timerT2>
         <maxRedirects>70</maxRedirects>
         <remotePartyID>false</remotePartyID>
         <userInfo>None</userInfo>
      </sipStack>
      <autoAnswerTimer>1</autoAnswerTimer>
      <autoAnswerAltBehavior>false</autoAnswerAltBehavior>
      <autoAnswerOverride>true</autoAnswerOverride>
      <transferOnhookEnabled>false</transferOnhookEnabled>
      <enableVad>false</enableVad>
      <dtmfAvtPayload>101</dtmfAvtPayload>
      <dtmfDbLevel>3</dtmfDbLevel>
      <dtmfOutofBand>avt</dtmfOutofBand>
      <alwaysUsePrimeLine>false</alwaysUsePrimeLine>
      <alwaysUsePrimeLineVoiceMail>false</alwaysUsePrimeLineVoiceMail>
      <kpml>3</kpml>
      <phoneLabel>${phoneLabel}</phoneLabel>
      <stutterMsgWaiting>1</stutterMsgWaiting>
      <callStats>false</callStats>
      <silentPeriodBetweenCallWaitingBursts>10</silentPeriodBetweenCallWaitingBursts>
      <disableLocalSpeedDialConfig>false</disableLocalSpeedDialConfig>
      <sipLines>`;

    // Línea 1
    if (line1Enabled) {
        xml += `
         <line button="1">
            <featureID>9</featureID>
            <featureLabel>${line1DisplayName}</featureLabel>
            <proxy>${sipServer}</proxy>
            <port>${sipPort}</port>
            <name>${line1Extension}</name>
            <displayName>${line1DisplayName}</displayName>
            <autoAnswer>
               <autoAnswerEnabled>2</autoAnswerEnabled>
            </autoAnswer>
            <callWaiting>3</callWaiting>
            <authName>${line1AuthName}</authName>
            <authPassword>${line1Password}</authPassword>
            <sharedLine>false</sharedLine>
            <messageWaitingLampPolicy>1</messageWaitingLampPolicy>
            <messagesNumber>*97</messagesNumber>
            <ringSettingIdle>4</ringSettingIdle>
            <ringSettingActive>5</ringSettingActive>
            <contact>${line1Contact || line1Extension}</contact>
            <forwardCallInfoDisplay>
               <callerName>true</callerName>
               <callerNumber>false</callerNumber>
               <redirectedNumber>false</redirectedNumber>
               <dialedNumber>true</dialedNumber>
            </forwardCallInfoDisplay>`;

        if (hotlineEnabled && hotlineNumber) {
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

    // Línea 2
    if (line2Enabled) {
        xml += `
         <line button="2">
            <featureID>9</featureID>
            <featureLabel>${line2DisplayName}</featureLabel>
            <proxy>${sipServer}</proxy>
            <port>${sipPort}</port>
            <name>${line2Extension}</name>
            <displayName>${line2DisplayName}</displayName>
            <autoAnswer>
               <autoAnswerEnabled>2</autoAnswerEnabled>
            </autoAnswer>
            <callWaiting>3</callWaiting>
            <authName>${line2AuthName}</authName>
            <authPassword>${line2Password}</authPassword>
            <sharedLine>false</sharedLine>
            <messageWaitingLampPolicy>1</messageWaitingLampPolicy>
            <messagesNumber>*97</messagesNumber>
            <ringSettingIdle>4</ringSettingIdle>
            <ringSettingActive>5</ringSettingActive>
            <contact>${line2Contact || line2Extension}</contact>
            <forwardCallInfoDisplay>
               <callerName>true</callerName>
               <callerNumber>false</callerNumber>
               <redirectedNumber>false</redirectedNumber>
               <dialedNumber>true</dialedNumber>
            </forwardCallInfoDisplay>
         </line>`;
    }

    xml += `
      </sipLines>
      <voipControlPort>5060</voipControlPort>
      <startMediaPort>16348</startMediaPort>
      <stopMediaPort>20134</stopMediaPort>
      <dscpForAudio>184</dscpForAudio>
      <ringSettingBusyStationPolicy>0</ringSettingBusyStationPolicy>
      <dialTemplate>dialplan.xml</dialTemplate>
      <softKeyFile></softKeyFile>
   </sipProfile>
   <commonProfile>
      <phonePassword></phonePassword>
      <backgroundImageAccess>true</backgroundImageAccess>
      <callLogBlfEnabled>2</callLogBlfEnabled>
   </commonProfile>
   <loadInformation>sip78xx.10-1-1SR1-4</loadInformation>
   <vendorConfig>
      <disableSpeaker>false</disableSpeaker>
      <disableSpeakerAndHeadset>false</disableSpeakerAndHeadset>
      <pcPort>0</pcPort>
      <settingsAccess>1</settingsAccess>
      <garp>0</garp>
      <voiceVlanAccess>0</voiceVlanAccess>
      <videoCapability>0</videoCapability>
      <autoSelectLineEnable>0</autoSelectLineEnable>
      <webAccess>${webAccess ? '1' : '0'}</webAccess>
      <daysDisplayNotActive>1,2,3,4,5,6,7</daysDisplayNotActive>
      <displayOnTime>00:00</displayOnTime>
      <displayOnDuration>00:00</displayOnDuration>
      <displayIdleTimeout>00:00</displayIdleTimeout>
      <spanToPCPort>1</spanToPCPort>
      <loggingDisplay>1</loggingDisplay>
      <loadServer></loadServer>
   </vendorConfig>
   <userLocale>
      <name></name>
      <uid></uid>
      <langCode>en_US</langCode>
      <version>1.0.0.0-1</version>
      <winCharSet>iso-8859-1</winCharSet>
   </userLocale>
   <networkLocale></networkLocale>
   <networkLocaleInfo>
      <name></name>
      <uid></uid>
      <version>1.0.0.0-1</version>
   </networkLocaleInfo>
   <deviceSecurityMode>1</deviceSecurityMode>
   <authenticationURL></authenticationURL>
   <directoryURL>${directoryURL}</directoryURL>
   <servicesURL></servicesURL>
   <idleURL></idleURL>
   <informationURL></informationURL>
   <messagesURL></messagesURL>
   <proxyServerURL></proxyServerURL>
   <dscpForSCCPPhoneConfig>96</dscpForSCCPPhoneConfig>
   <dscpForSCCPPhoneServices>0</dscpForSCCPPhoneServices>
   <dscpForCm2Dvce>96</dscpForCm2Dvce>
   <transportLayerProtocol>2</transportLayerProtocol>
   <capfAuthMode>0</capfAuthMode>
   <capfList>
      <capf>
         <phonePort>3804</phonePort>
      </capf>
   </capfList>
   <certHash></certHash>
   <encrConfig>false</encrConfig>
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

// Event listeners para actualizar el XML en tiempo real
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        if (currentStep === 4) generateXML();
    });
    input.addEventListener('change', function() {
        if (currentStep === 4) generateXML();
    });
});

// Generar XML inicial
generateXML();