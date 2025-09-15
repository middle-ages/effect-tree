import {identity} from 'effect'
import {
  addLevelLabels,
  bottomSubtrees,
  Codec,
  drawTree,
  from,
  of,
} from '../index.js'

// “from” lets you create trees with less brackets than would be required with
// “branch” or “tree”.
//
// const genealogy = from( // ← create a branch
//   'Metuselah',          //   first argument is branch value
//   ...                   //   thee rest are members of the node forest
//
export const genealogy = from(
  'Metuselah',
  from(
    'Lamech',
    from(
      'Noah',
      from(
        'Shem',
        of('Elam'),
        of('Asshur'),
        of('Arphachshad'),
        of('Lud'),
        of('Aram'),
      ),
      from(
        'Ham',
        of('Cush'),
        of('Egypt'),
        of('Put'),
        from('Canaan', of('Sidon'), of('Heth')),
      ),
      of('Aram'),
    ),
    from(
      'Japheth',
      of('Gomer'),
      of('Magog'),
      of('Media'),
      of('Javan'),
      of('Tubal'),
      of('Meshech'),
      of('Tiras'),
    ),
  ),
)

console.log(drawTree(genealogy).join('\n'))

/**

┬Metuselah      
└┬Lamech        
 ├┬Noah         
 │├┬Shem        
 ││├─Elam       
 ││├─Asshur     
 ││├─Arphachshad
 ││├─Lud        
 ││└─Aram       
 │├┬Ham         
 ││├─Cush       
 ││├─Egypt      
 ││├─Put        
 ││└┬Canaan     
 ││ ├─Sidon     
 ││ └─Heth      
 │└─Aram        
 └┬Japheth      
  ├─Gomer       
  ├─Magog       
  ├─Media       
  ├─Javan       
  ├─Tubal       
  ├─Meshech     
  └─Tiras       

*/

// Annotate each tree node with its level label encoding its path to root.
const labeled = addLevelLabels(genealogy)

console.log(drawTree(labeled).join('\n'))

/**

┬1. Metuselah              
└┬1.1. Lamech              
 ├┬1.1.1. Noah             
 │├┬1.1.1.1. Shem          
 ││├─1.1.1.1.1. Elam       
 ││├─1.1.1.1.2. Asshur     
 ││├─1.1.1.1.3. Arphachshad
 ││├─1.1.1.1.4. Lud        
 ││└─1.1.1.1.5. Aram       
 │├┬1.1.1.2. Ham           
 ││├─1.1.1.2.1. Cush       
 ││├─1.1.1.2.2. Egypt      
 ││├─1.1.1.2.3. Put        
 ││└┬1.1.1.2.4. Canaan     
 ││ ├─1.1.1.2.4.1. Sidon   
 ││ └─1.1.1.2.4.2. Heth    
 │└─1.1.1.3. Aram          
 └┬1.1.2. Japheth          
  ├─1.1.2.1. Gomer         
  ├─1.1.2.2. Magog         
  ├─1.1.2.3. Media         
  ├─1.1.2.4. Javan         
  ├─1.1.2.5. Tubal         
  ├─1.1.2.6. Meshech       
  └─1.1.2.7. Tiras         

*/

// Loop over all bottom-grounded subtrees and draw them.  For a tree with 25
// nodes there are exactly 25 such subtrees. The final subtree is identical to
// the entire tree.
let i = 0
for (const tree of bottomSubtrees(genealogy)) {
  i++
  console.log(`\nSubtree #${i.toString()}`)
  console.log(drawTree(tree).join('\n'))
}

/**

Subtree #1
─Elam

Subtree #2
─Asshur

Subtree #3
─Arphachshad

Subtree #4
─Lud

Subtree #5
─Aram

Subtree #6
┬Shem        
├─Elam       
├─Asshur     
├─Arphachshad
├─Lud        
└─Aram       

Subtree #7
─Cush

Subtree #8
─Egypt

Subtree #9
─Put

Subtree #10
─Sidon

Subtree #11
─Heth

Subtree #12
┬Canaan
├─Sidon
└─Heth 

Subtree #13
┬Ham    
├─Cush  
├─Egypt 
├─Put   
└┬Canaan
 ├─Sidon
 └─Heth 

Subtree #14
─Aram

Subtree #15
┬Noah         
├┬Shem        
│├─Elam       
│├─Asshur     
│├─Arphachshad
│├─Lud        
│└─Aram       
├┬Ham         
│├─Cush       
│├─Egypt      
│├─Put        
│└┬Canaan     
│ ├─Sidon     
│ └─Heth      
└─Aram        

Subtree #16
─Gomer

Subtree #17
─Magog

Subtree #18
─Media

Subtree #19
─Javan

Subtree #20
─Tubal

Subtree #21
─Meshech

Subtree #22
─Tiras

Subtree #23
┬Japheth 
├─Gomer  
├─Magog  
├─Media  
├─Javan  
├─Tubal  
├─Meshech
└─Tiras  

Subtree #24
┬Lamech        
├┬Noah         
│├┬Shem        
││├─Elam       
││├─Asshur     
││├─Arphachshad
││├─Lud        
││└─Aram       
│├┬Ham         
││├─Cush       
││├─Egypt      
││├─Put        
││└┬Canaan     
││ ├─Sidon     
││ └─Heth      
│└─Aram        
└┬Japheth      
 ├─Gomer       
 ├─Magog       
 ├─Media       
 ├─Javan       
 ├─Tubal       
 ├─Meshech     
 └─Tiras       

Subtree #25
┬Metuselah      
└┬Lamech        
 ├┬Noah         
 │├┬Shem        
 ││├─Elam       
 ││├─Asshur     
 ││├─Arphachshad
 ││├─Lud        
 ││└─Aram       
 │├┬Ham         
 ││├─Cush       
 ││├─Egypt      
 ││├─Put        
 ││└┬Canaan     
 ││ ├─Sidon     
 ││ └─Heth      
 │└─Aram        
 └┬Japheth      
  ├─Gomer       
  ├─Magog       
  ├─Media       
  ├─Javan       
  ├─Tubal       
  ├─Meshech     
  └─Tiras       

*/

// Encode a string tree as an indented list of strings à la YAML.
const encoded = Codec.Indented.encode(2)(identity<string>)(genealogy)

console.log(encoded.join('\n'))

/**

Metuselah
  Lamech
    Noah
      Shem
        Elam
        Asshur
        Arphachshad
        Lud
        Aram
      Ham
        Cush
        Egypt
        Put
        Canaan
          Sidon
          Heth
      Aram
    Japheth
      Gomer
      Magog
      Media
      Javan
      Tubal
      Meshech
      Tiras

*/
