import { TopicContent } from '@/types';

export const cdTopics: Record<string, TopicContent> = {
  'cd-1-1': {
    id: 'cd-1-1',
    name: 'Phases of a Compiler',
    subjectId: 'compiler-design',
    unitNo: 'I',
    subtopics: ['Compiler', 'Analysis of source program', 'Phases of compiler'],
    updatedAt: new Date().toISOString(),
    summary: [
      'A compiler operates in sequence of phases, translating source code to target code.',
      'The Front-End handles analysis (Lexical, Syntax, Semantic) and is language-dependent.',
      'The Back-End handles synthesis (Optimization, Code Gen) and is machine-dependent.',
      'Symbol Table and Error Handler interact with all phases.',
      'Output of one phase serves as input to the next phase.'
    ],
    definition: '<p>A <strong>compiler phase</strong> is a logically cohesive operation that takes one representation of the source program and translates it into another representation. The standard compiler pipeline consists of <strong>six major phases</strong> operating sequentially to produce optimized machine code.</p>',
    diagrams: [
      {
        id: 'diag-1',
        title: 'Compiler Flow Pipeline',
        type: 'mermaid',
        content: `graph TD
    A[Source Program] -->|Character Stream| B(Lexical Analyzer)
    B -->|Token Stream| C(Syntax Analyzer)
    C -->|Syntax Tree| D(Semantic Analyzer)
    D -->|Annotated Tree| E(Intermediate Code Gen)
    E -->|Intermediate Rep| F(Code Optimizer)
    F -->|Optimized IR| G(Target Code Gen)
    G --> H[Target Machine Code]
    
    I((Symbol Table)) -.-> B
    I -.-> C
    I -.-> D
    I -.-> E
    I -.-> F
    I -.-> G`,
        caption: 'The standard sequential flow of the 6 compiler phases.'
      }
    ],
    keyPoints: [
      { id: 'kp1', text: 'Lexical Analyzer converts char stream into tokens.', isHighlight: true },
      { id: 'kp2', text: 'Syntax Analyzer creates a parse tree checking grammatical structure.' },
      { id: 'kp3', text: 'Semantic Analyzer performs type checking and scope resolution.', isHighlight: true },
      { id: 'kp4', text: 'Intermediate Code generation yields hardware-agnostic Three Address Code.' },
      { id: 'kp5', text: 'Machine Independent Optimization reduces execution time and space.' },
      { id: 'kp6', text: 'Target Code Generation selects registers and manages memory.' }
    ],
    tables: [
      {
        title: 'Front-End vs Back-End',
        headers: ['Property', 'Front-End (Analysis)', 'Back-End (Synthesis)'],
        rows: [
          ['Dependency', 'Source Language Dependent', 'Target Machine Dependent'],
          ['Phases', 'Lexical, Syntax, Semantic, IR Gen', 'Optimization, Target Gen'],
          ['Primary Role', 'Understand and check correctness', 'Map IR to specific hardware instructions']
        ],
        highlightCol: 0
      }
    ],
    examples: [
      {
        type: 'code',
        language: 'c',
        title: 'Example Assignment Statement',
        content: 'position = initial + rate * 60;\n\n/* \nTokens: \n[id,1] [=] [id,2] [+] [id,3] [*] [number, 60] \n*/',
        explanation: 'Lexical phase assigns tokens. The Symbol table links id,1 to position.'
      }
    ],
    examTip: {
      threeMark: 'List the 6 phases of a compiler in exact order and define the role of the Lexical Analyzer.',
      fourMark: 'Explain the distinct functions of the analysis and synthesis parts of compilation, illustrating with a Block Diagram.',
      sixMark: 'Describe the complete compiler pipeline from source program to target machine code, detailing the interaction with the Symbol Table and Error Handler.',
      neverForget: [
        'Symbol Table and Error Handler must connect to EVERY phase in block diagrams.',
        'Syntax checking does NOT guarantee Semantic correctness (e.g., mismatching data types).'
      ],
      examFrequency: 'very-high',
      previousYearRef: 'SVIIT 2023, 2022'
    },
    relatedTopics: ['cd-1-2']
  }
};
