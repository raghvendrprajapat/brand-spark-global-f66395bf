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
    const { domainName } = await req.json();
    
    if (!domainName) {
      throw new Error('Domain name is required');
    }

    console.log('Checking domain availability for:', domainName);

    // Check multiple TLDs
    const tlds = ['com', 'in', 'ai'];
    const results: Record<string, boolean> = {};

    // Check each TLD
    for (const tld of tlds) {
      const fullDomain = `${domainName.toLowerCase().replace(/\s+/g, '')}.${tld}`;
      
      try {
        // Use DNS lookup to check if domain exists
        // If DNS resolution fails, domain is likely available
        const dnsResponse = await fetch(`https://dns.google/resolve?name=${fullDomain}&type=A`);
        const dnsData = await dnsResponse.json();
        
        // If there's no Answer section or it's empty, domain is likely available
        // If there are answers, domain is taken
        results[tld] = !dnsData.Answer || dnsData.Answer.length === 0;
        
        console.log(`${fullDomain}: ${results[tld] ? 'Available' : 'Taken'}`);
      } catch (error) {
        console.error(`Error checking ${fullDomain}:`, error);
        // On error, assume available (to be safe)
        results[tld] = true;
      }
    }

    return new Response(
      JSON.stringify({ 
        domainName,
        availability: results,
        checked: true 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in check-domain function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        checked: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
