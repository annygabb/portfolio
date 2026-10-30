"""English translation of the user-supplied current CV; no invented qualifications."""
from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from pypdf import PdfReader, PdfWriter
for name,file in [('CV','DejaVuSans.ttf'),('CV-Bold','DejaVuSans-Bold.ttf')]:
 pdfmetrics.registerFont(TTFont(name,'/usr/share/fonts/truetype/dejavu/'+file))
ink=colors.HexColor('#142033');blue=colors.HexColor('#2455d6')
styles={
 'name':ParagraphStyle('name',fontName='CV-Bold',fontSize=13.2,leading=18,textColor=ink,alignment=TA_CENTER,spaceAfter=5),
 'role':ParagraphStyle('role',fontName='CV',fontSize=8.7,leading=12,textColor=ink,alignment=TA_CENTER,spaceAfter=5),
 'contact':ParagraphStyle('contact',fontName='CV',fontSize=7.6,leading=11,textColor=ink,alignment=TA_CENTER,spaceAfter=10),
 'section':ParagraphStyle('section',fontName='CV-Bold',fontSize=9.5,leading=13,textColor=blue,spaceBefore=12,spaceAfter=6,keepWithNext=True),
 'body':ParagraphStyle('body',fontName='CV',fontSize=8.35,leading=11.8,textColor=ink,spaceAfter=5),
 'job':ParagraphStyle('job',fontName='CV-Bold',fontSize=8.6,leading=12,textColor=ink,spaceBefore=7,spaceAfter=4,keepWithNext=True),
 'bullet':ParagraphStyle('bullet',fontName='CV',fontSize=8.35,leading=11.8,textColor=ink,leftIndent=9,firstLineIndent=-7,spaceAfter=4)
}
story=[]
def p(text,kind='body'):story.append(Paragraph(text,styles[kind]))
def section(s):p(s.upper(),'section')
def bullet(s):p('- '+s,'bullet')
p('ANNY GABRIELLY GONÇALVES DE OLIVEIRA','name')
p('Systems Analyst &amp; Full-Stack Developer | ServiceNow, Power Automate, React, Java/Spring','role')
p('Silvânia, Goiás, Brazil | +55 62 99661-6445 | annygabbyoficial@gmail.com<br/><link href="https://www.linkedin.com/in/annygabrielly/" color="#2455d6">linkedin.com/in/annygabrielly</link>','contact')
section('Career objective')
p('To work as a Software Developer / Systems Analyst, applying and expanding my knowledge of Java, JavaScript, React, ServiceNow and process automation while contributing innovative solutions in dynamic, collaborative environments.')
section('Professional summary')
p('Full-Stack Developer and Systems Analyst in the eighth semester of a Software Engineering degree at UniEVANGÉLICA. I build interfaces and automation that address real problems, combining front-end development (React, Tailwind), back-end development (Java, Spring Boot, PostgreSQL) and process automation (ServiceNow, Power Automate). At NTT DATA Europe &amp; Latam, I work on integrations and automation to reduce manual work and improve operational efficiency. I also deliver freelance institutional websites for healthcare, legal and aesthetics businesses and develop independent projects such as Help, my final-year project.')
section('Skills')
p('<b>Languages &amp; frameworks:</b> Java, JavaScript, HTML5, CSS3, React, Spring Boot, Tailwind CSS.')
p('<b>Automation &amp; platforms:</b> ServiceNow, Power Automate, Git/GitHub, Vite, Maven, PostgreSQL, Postman, Azure, Vercel.')
p('<b>Methods &amp; interpersonal skills:</b> Process automation, Scrum, initiative, leadership, teamwork, analytical thinking and creativity.')
p('<b>Certification:</b> Scrum Fundamentals Certified (SFC). <b>Languages:</b> Native Portuguese; intermediate English.')
section('Professional experience')
p('Full-Stack Developer | Self-employed | July 2026 - Present','job')
bullet('Deliver full-stack solutions for small businesses, from briefing to publication, including institutional websites for healthcare, legal, aesthetics and administrative services, using HTML, CSS, JavaScript, React and Tailwind.')
bullet('Created a reusable skill to standardize the development process from briefing to delivery, supporting faster work while maintaining consistent quality across projects.')
p('Systems Analyst | NTT DATA Europe &amp; Latam | February 2026 - Present','job')
bullet('Develop applications, integrations and automation with ServiceNow, Power Automate, HTML and JavaScript, supporting an average volume of 60 tickets per month.')
bullet('Build event-driven flows, subflows and actions for validation, integrations and other automation needs, focusing on process optimization and continuous improvement.')
bullet('Developed a data-checking automation with an AI agent integrated into Power Automate to extract data from photographs and organize it in a spreadsheet for human validation, removing intermediate manual entry and checking tasks previously performed by three people.')
bullet('Maintain and improve automation already in production, resolving day-to-day operational issues and continuously improving workflows.')
p('Administrative Assistant | Instituto Auxiliadora | January 2025 - January 2026 | Silvânia, GO','job')
bullet('Improved internal workflows through document organization and digitization; created management reports and spreadsheets with standardized data presentation; performed preventive hardware and software maintenance to reduce support incidents.')
p('Digital Print Operator | Papelutti | May 2024 - December 2024 | Silvânia, GO','job')
bullet('Checked technical specifications to reduce production errors and improve material use; applied graphic design principles to final layout adjustments and product presentation.')
p('Administrative Intern | TRE-GO | May 2022 - December 2022 | Silvânia, GO','job')
bullet('Supported administrative activities and office routines, developing a foundation in process management.')
story.append(PageBreak())
section('Education')
p('<b>Bachelor’s degree in Software Engineering</b> | Universidade Evangélica de Goiás (UniEVANGÉLICA)<br/>January 2023 - December 2026 (expected graduation); currently in the eighth semester.')
p('<b>Additional courses:</b> HTML5 and CSS3 (Curso em Vídeo); Artificial Intelligence for Small Businesses (Sebrae); Object-Oriented Programming and Programming Logic Fundamentals (Fundação Bradesco).')
section('Certifications & additional training')
p('<b>NTT DATA:</b> Java and AI for Beginners Bootcamp, 48 hours | August 2025.')
p('<b>CI&amp;T / DIO:</b> Introduction to the Backend Bootcamp with Java &amp; AWS | December 2025.')
p('<b>Santander / DIO:</b> Introduction to Cybersecurity | October 2025.')
p('<b>Java learning path (DIO, 2025):</b> Java language fundamentals; control structures; object-oriented programming and data structures; inheritance and polymorphism; interfaces and lambdas; collections; debugging and exception handling; dependency management with Maven and Gradle; file and directory I/O; building a financial transaction application using object-oriented programming.')
p('<b>DevOps &amp; Cloud learning path (DIO, 2025):</b> DevOps fundamentals; introduction to CI/CD; DevOps and software development processes; cloud computing fundamentals; Azure application platform fundamentals; web applications with Azure App Service.')
p('<b>Git, Generative AI &amp; Cybersecurity learning path (DIO/Santander, 2025):</b> Version control with Git and GitHub; contributing to an open-source GitHub project; introduction to prompt engineering and GitHub Copilot with Java; configuring and using GitHub Copilot; cybersecurity principles; application development principles.')
section('Projects & case studies')
p('Help | Software Engineering final-year project','job')
p('Academic full-stack solution at UniEVANGÉLICA: a secure, auditable ecosystem connecting service providers, customers and recruiters in the informal market. Stack: Java 21, Spring Boot, PostgreSQL, React.js and Postman.')
p('Institutional websites | Freelance','job')
p('Delivered institutional websites for small businesses in healthcare, legal, aesthetics and administrative services, focusing on performance, responsiveness and conversion. Stack: HTML/CSS/JavaScript, React and Tailwind. Full portfolio: <link href="https://portfoliosolucoesanny.vercel.app/" color="#2455d6">portfoliosolucoesanny.vercel.app</link>.')
p('Professional portfolio | Personal project','job')
p('Professional portfolio with light mode, Portuguese/English switching, scroll animations and CV download. Stack: HTML5, CSS3, JavaScript and Tailwind. Website: <link href="https://portfolioanny.vercel.app/" color="#2455d6">portfolioanny.vercel.app</link>.')
p('Grocery List | Personal project','job')
p('Tool for creating shareable shopping lists and calculating totals per product and supermarket. Stack: HTML, CSS and JavaScript.')
section('Leadership & interests')
p('<b>RoboCode | University event | 2025:</b> Fourth place in a team competition developing Java robots for battles in a controlled environment with technical criteria.')
p('<b>Campus Party | Goiânia, GO | 2025:</b> Participated in a major technology event, attending talks on AI, entrepreneurship and technology trends.')
output=Path('public/assets/Anny-Gabrielly-Resume-EN.pdf')
def footer(c,doc):
 c.setStrokeColor(colors.HexColor('#dce3ed'));c.line(42,32,A4[0]-42,32);c.setFillColor(colors.HexColor('#536176'));c.setFont('CV',7);c.drawString(42,21,'Anny Gabrielly | Systems Analyst & Full-Stack Developer');c.drawRightString(A4[0]-42,21,str(doc.page))
doc=SimpleDocTemplate(str(output),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=34,bottomMargin=45,title='Anny Gabrielly - Resume',author='Anny Gabrielly Gonçalves de Oliveira')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
r=PdfReader(str(output));w=PdfWriter();w.clone_document_from_reader(r)
from pypdf.generic import NameObject,TextStringObject
w._root_object.update({NameObject('/Lang'):TextStringObject('en-US')})
with output.open('wb') as f:w.write(f)
print(output, 'pages:',len(r.pages))
