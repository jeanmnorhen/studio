
import { config } from 'dotenv';
config();

// Importa o novo fluxo de identificação de objetos
import '@/ai/flows/object-identification-flow';
// A ferramenta identifyObjectsInImageTool é importada e usada pelo fluxo acima,
// então não precisa ser importada separadamente aqui para registro,
// mas se tivéssemos outras ferramentas independentes, elas seriam importadas.
// Exemplo: import '@/ai/tools/minha-outra-ferramenta';

// Adicione aqui importações de novos fluxos ou ferramentas conforme forem criados.
