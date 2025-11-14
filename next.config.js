 /** @type {import('next').NextConfig} */                  
     const nextConfig = {                                      
       reactStrictMode: true,                                  
       images: {
         remotePatterns: [                                     
           {                                                   
             protocol: "https",                                
             hostname: "**"                                    
           }                                                   
         ]                                                     
       },                                                      
       typescript: {                                           
         // Allow production builds even if there are type     
  errors.                                                      
         ignoreBuildErrors: true                               
       },                                                      
       eslint: {                                               
         // Skip ESLint during builds; we don't rely on it     
  in CI.                                                       
         ignoreDuringBuilds: true                              
       }                                                       
     };                                                        
                                                               
     module.exports = nextConfig; 
