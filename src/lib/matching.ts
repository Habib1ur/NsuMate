  import { prisma } from "./prisma";                           
                                                               
  // Simple academic-aware matching algorithm.
  // Each criteria contributes points to the total score.      
  export function computeMatchScore(a: any, b: any): number {  
    let score = 0;                                             
                                                               
    if (a.department === b.department) {                       
      score += 15;                                             
    }                                                          
                                                               
    if (a.semester === b.semester) {                           
      score += 10;                                             
    }                                                          
                                                               
    if (a.universityYear === b.universityYear) {               
      score += 10;                                             
    }                                                          
                                                               
    const cgpaDiff = Math.abs(a.cgpa - b.cgpa);                
    if (cgpaDiff <= 0.3) {                                     
      score += 15;                                             
    } else if (cgpaDiff <= 0.7) {                              
      score += 8;                                              
    }                                                          
                                                               
    const interestsOverlap = (a.interests || []).filter((i:    
  string) =>                                                   
      (b.interests || []).includes(i)                          
    ).length;                                                  
    score += interestsOverlap * 3;                             
                                                               
    if (a.prefSameDepartment && a.department === b.department) 
  {                                                            
      score += 5;                                              
    }                                                          
    if (b.prefSameDepartment && a.department === b.department) 
  {                                                            
      score += 5;                                              
    }                                                          
                                                               
    if (a.prefSimilarCgpa && cgpaDiff <= 0.5) {                
      score += 5;                                              
    }                                                          
    if (b.prefSimilarCgpa && cgpaDiff <= 0.5) {                
      score += 5;                                              
    }                                                          
                                                               
    if (                                                       
      a.prefSameSemesterOrYear &&                              
      (a.semester === b.semester || a.universityYear ===       
  b.universityYear)                                            
    ) {                                                        
      score += 5;                                              
    }                                                          
    if (                                                       
      b.prefSameSemesterOrYear &&                              
      (a.semester === b.semester || a.universityYear ===       
  b.universityYear)                                            
    ) {                                                        
      score += 5;                                              
    }                                                          
                                                               
    return score;                                              
  }                                                            
                                                               
  export async function ensureMatchBetween(userId: string,     
  otherId: string) {
    if (userId === otherId) return null;
                                                               
    const [a, b] = await Promise.all([                         
      prisma.user.findUnique({ where: { id: userId } }),       
      prisma.user.findUnique({ where: { id: otherId } })       
    ]);                                                        
    if (!a || !b) return null;                                 

    const score = computeMatchScore(a, b);                     
                                                               
    const existing = await prisma.match.findUnique({           
      where: { initiatorId_receiverId: { initiatorId: a.id,    
  receiverId: b.id } }                                         
    });                                                        
                                                               
    if (existing) {                                            
      return existing;                                         
    }                                                          
                                                               
    const reverse = await prisma.match.findUnique({            
      where: { initiatorId_receiverId: { initiatorId: b.id,    
  receiverId: a.id } }                                         
    });                                                        
                                                               
    const match = await prisma.match.create({                  
      data: {                                                  
        initiatorId: a.id,                                     
        receiverId: b.id,                                      
        score,                                                 
        isMutual: !!reverse                                    
      }                                                        
    });                                                        
                                                               
    if (reverse && !reverse.isMutual) {                        
      await prisma.match.update({                              
        where: { id: reverse.id },                             
        data: { isMutual: true }                               
      });                                                      
      await prisma.match.update({                              
        where: { id: match.id },
        data: { isMutual: true }                               
      });                                                      
    }                                                          
                                                               
    return match;                                              
  }  
