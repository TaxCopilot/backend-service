/**
 * Draft Templates
 *
 * Predefined HTML templates for common legal/tax document types.
 * Each template has an ID, title, Prisma category, and HTML content.
 */

export interface DraftTemplate {
  title: string;
  category: string;
  html: string;
}

export const TEMPLATES: Record<string, DraftTemplate> = {
  scn_reply: {
    title: 'SCN Reply Template',
    category: 'SCN_REPLY',
    html: `<p style="text-align: right;">Date: [DD/MM/YYYY]</p>
<p>To,<br>The [Designation],<br>[Office Address]</p>
<p><strong>Subject: Reply to Show Cause Notice [Reference No.] dated [Date]</strong></p>
<p>Respected Sir/Madam,</p>
<p>This is with reference to the Show Cause Notice issued in FORM GST REG-17 dated [Date], proposing [action]. We respectfully submit the following:</p>
<ol>
<li><strong>Brief Facts:</strong> [Describe the facts of the case]</li>
<li><strong>Grounds of Defence:</strong> [Legal grounds and reasoning]</li>
<li><strong>Supporting Evidence:</strong> [Reference documents attached]</li>
<li><strong>Prayer:</strong> In light of the above submissions, we humbly request that the proceedings may kindly be dropped.</li>
</ol>
<p>Thanking you,</p>
<p>Yours faithfully,<br>[Name]<br>[Designation]<br>[Firm Name]</p>`,
  },

  appeal_memorandum: {
    title: 'Appeal Memorandum Template',
    category: 'APPEAL_MEMORANDUM',
    html: `<p style="text-align: center;"><strong>BEFORE THE [APPELLATE AUTHORITY]</strong></p>
<p style="text-align: center;"><strong>Appeal No. _______ of [Year]</strong></p>
<p><strong>In the matter of:</strong></p>
<p>[Appellant Name] ..... Appellant<br>Vs.<br>[Respondent Authority] ..... Respondent</p>
<p><strong>MEMORANDUM OF APPEAL</strong></p>
<p>Under Section [Section Number] of the [Act Name], the appellant hereby prefers this appeal against the Order-in-Original No. [Order No.] dated [Date] passed by [Authority].</p>
<ol>
<li><strong>Facts of the Case:</strong> [Narrate the facts chronologically]</li>
<li><strong>Grounds of Appeal:</strong>
  <ol>
    <li>[Ground 1]</li>
    <li>[Ground 2]</li>
    <li>[Ground 3]</li>
  </ol>
</li>
<li><strong>Relief Sought:</strong> [State the specific relief requested]</li>
</ol>
<p><strong>Prayer:</strong> It is therefore prayed that the impugned order may be set aside in the interest of justice.</p>
<p>[Place]<br>[Date]<br><br>Authorized Representative</p>`,
  },

  legal_opinion: {
    title: 'Legal Opinion Template',
    category: 'LEGAL_OPINION',
    html: `<p style="text-align: right;">Date: [DD/MM/YYYY]</p>
<p><strong>LEGAL OPINION</strong></p>
<p><strong>Re:</strong> [Subject Matter]<br><strong>Client:</strong> [Client Name]<br><strong>Reference:</strong> [Reference No.]</p>
<hr>
<p><strong>1. BACKGROUND</strong></p>
<p>[Provide factual background of the matter]</p>
<p><strong>2. ISSUES FOR CONSIDERATION</strong></p>
<ol>
<li>[Issue 1]</li>
<li>[Issue 2]</li>
</ol>
<p><strong>3. APPLICABLE LAW</strong></p>
<p>[Cite relevant statutes, rules, and precedents]</p>
<p><strong>4. ANALYSIS</strong></p>
<p>[Detailed legal analysis for each issue]</p>
<p><strong>5. OPINION</strong></p>
<p>[Clear opinion on each issue raised]</p>
<p><strong>6. RECOMMENDATIONS</strong></p>
<ul>
<li>[Recommendation 1]</li>
<li>[Recommendation 2]</li>
</ul>
<hr>
<p><em>This opinion is based on the facts and documents presented. Any change in facts may alter the opinion.</em></p>
<p>[Advocate Name]<br>[Registration / Enrollment No.]</p>`,
  },

  general: {
    title: 'General Draft Template',
    category: 'GENERAL',
    html: `<p style="text-align: right;">Date: [DD/MM/YYYY]</p>
<p>To,<br>[Recipient Name]<br>[Recipient Address]</p>
<p><strong>Subject: [Subject Line]</strong></p>
<p>Dear Sir/Madam,</p>
<p>[Body of the document]</p>
<p>Yours faithfully,<br>[Name]<br>[Designation]</p>`,
  },
};
