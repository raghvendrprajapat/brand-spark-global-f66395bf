import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      throw new Error('API key not configured');
    }

    // Build the prompt
    const styles = [];
    if (formData.coined) styles.push("coined");
    if (formData.compound) styles.push("compound");
    if (formData.blend) styles.push("blend");
    if (formData.metaphor) styles.push("metaphor");

    const languages = [];
    if (formData.english) languages.push("English");
    if (formData.hinglish) languages.push("Hinglish");
    
    const prompt = `Generate exactly 10 unique brand names for the ${formData.industry} industry.

Style preferences: ${styles.join(", ")}
Languages: ${languages.join(", ")}
${formData.startingLetter ? `Starting letter(s): ${formData.startingLetter}` : ""}
${formData.includeKeywords ? `Must include keywords: ${formData.includeKeywords}` : ""}
${formData.avoidKeywords ? `Avoid keywords: ${formData.avoidKeywords}` : ""}
${formData.otherRequirements ? `Additional requirements: ${formData.otherRequirements}` : ""}

Return ONLY the 10 brand names, one per line, with no numbering, explanations, or additional text.`;

    console.log('Sending request to Gemini API...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data));
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      console.error('No text content in response');
      throw new Error('No content generated');
    }

    const names = generatedText
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .slice(0, 10);
    
    console.log('Generated names:', names);

    return new Response(
      JSON.stringify({ names }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-brand-names:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
