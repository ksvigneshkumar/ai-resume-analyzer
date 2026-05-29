from rest_framework.decorators import api_view
from rest_framework.response import Response
import fitz
import docx
import google.generativeai as genai


genai.configure(api_key="YOUR_API_KEY")


model = genai.GenerativeModel("gemini-2.5-flash")


@api_view(['POST'])
def upload_resume(request):

    file = request.FILES.get('resume')

   
    if not file:
        return Response({
            "error": "No file uploaded"
        })

    filename = file.name.lower()

    text = ""

   
    if filename.endswith(".pdf"):

        pdf = fitz.open(stream=file.read(), filetype="pdf")

        for page in pdf:
            text += page.get_text()

   
    elif filename.endswith(".docx"):

        doc = docx.Document(file)

        for para in doc.paragraphs:
            text += para.text

    else:

        return Response({
            "error": "Only PDF and DOCX allowed"
        })

   

    required_skills = [

        "Python",
        "Django",
        "REST API",
        "SQL",
        "Git",
        "JavaScript",
        "React",
        "HTML",
        "CSS",
        "Node.js"

    ]

    matched_skills = []

    for skill in required_skills:

        if skill.lower() in text.lower():
            matched_skills.append(skill)

    missing_skills = list(
        set(required_skills) - set(matched_skills)
    )

  

    score = int(
        (len(matched_skills) / len(required_skills)) * 100
    )

 

    qualified = score >= 60

   

    prompt = f"""
    Analyze this resume and give short professional summary.

    Resume:
    {text[:3000]}
    """

    try:

        response = model.generate_content(prompt)

        summary = response.text

    except Exception as e:

        summary = str(e)

    return Response({

        "qualified": qualified,
        "score": score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "summary": summary

    })