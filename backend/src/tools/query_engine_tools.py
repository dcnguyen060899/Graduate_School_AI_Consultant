from llama_index.core.tools import QueryEngineTool, ToolMetadata

query_engine_tools = [
  QueryEngineTool(
      query_engine=USC_engine,
      metadata=ToolMetadata(
          name="USC_engine",
          description=(
              "Provides detailed information about the University of Southern California's (USC) Master of Applied Data Science program. "
              "The engine returns program-specific details in JSON format, including admission requirements, deadlines, GPA requirements, GRE/TOEFL waivers, "
              "funding opportunities, and program duration."
              "For example:"
                "{"
                "  'university': 'USC',"
                "  'program': 'Master of Applied Data Science',"
                "  'requirements': {"
                "    'GPA': '3.0',"
                "    'GRE': 'Required',"
                "    'TOEFL': 'Waived for degrees from English-speaking countries',"
                "    'deadline': 'December 1',"
                "    'duration': '2 years',"
                "    'funding': 'Available through scholarships and assistantships'"
                "  }"
                "}"
          ),
      ),
  ),
  
  QueryEngineTool(
      query_engine=UW_engine,
      metadata=ToolMetadata(
          name="UW_engine",
          description=(
              "Provides detailed information about the University of Washington's (UW) Master of Science in Data Science program. "
              "The engine returns program-specific details in JSON format, including admission requirements, deadlines, GPA requirements, GRE/TOEFL waivers, "
              "funding opportunities, and program duration."
              "For example:"
                "{"
                "  'university': 'UW',"
                "  'program': 'Master of Science in Data Science',"
                "  'requirements': {"
                "    'GPA': '3.2',"
                "    'GRE': 'Optional',"
                "    'TOEFL': 'Waived for degrees from English-speaking countries',"
                "    'deadline': 'January 15',"
                "    'duration': '1.5 years',"
                "    'funding': 'Limited funding available, primarily through assistantships'"
                "  }"
                "}"
          ),
      ),
  ),
  
  QueryEngineTool(
      query_engine=UC_Berkeley_engine,
      metadata=ToolMetadata(
          name="UC_Berkeley_engine",
          description=(
              "Provides detailed information about the University of California, Berkeley's (UC Berkeley) Master of Science in Computer Science program. "
              "The engine returns program-specific details in JSON format, including admission requirements, deadlines, GPA requirements, GRE/TOEFL waivers, "
              "funding opportunities, and program duration."
              "For example:"
                "{"
                "  'university': 'UC Berkeley',"
                "  'program': 'Master of Science in Computer Science',"
                "  'requirements': {"
                "    'GPA': '3.5',"
                "    'GRE': 'Optional',"
                "    'TOEFL': 'Waived for degrees from English-speaking countries',"
                "    'deadline': 'December 15',"
                "    'duration': '2 years',"
                "    'funding': 'Comprehensive funding through fellowships, scholarships, and assistantships'"
                "  }"
                "}"
          ),
      ),
  ),

  QueryEngineTool(
      query_engine=UC_Irvine_engine,
      metadata=ToolMetadata(
          name="UC_Irvine_engine",
          description=(
              "Provides detailed information about the University of California, Irvine's (UC Irvine) Master of Data Science program. "
              "The engine returns program-specific details in JSON format, including admission requirements, deadlines, GPA requirements, GRE/TOEFL waivers, "
              "funding opportunities, and program duration."
              "For example:"
                "{"
                "  'university': 'UC Irvine',"
                "  'program': 'Master of Data Science',"
                "  'requirements': {"
                "    'GPA': '3.0',"
                "    'GRE': 'Required',"
                "    'TOEFL': 'Waived for degrees from English-speaking countries',"
                "    'deadline': 'February 1',"
                "    'duration': '1.5-2 years',"
                "    'funding': 'Available through fellowships and assistantships'"
                "  }"
                "}"
          ),
      ),
  )
]
