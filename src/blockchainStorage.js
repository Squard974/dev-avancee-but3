import {readFile, writeFile} from 'node:fs/promises'
import {getDate, monSecret} from "./divers.js";
import {NotFoundError} from "./errors.js";
import {createHash} from 'node:crypto'
import { v4 as uuidv4 } from 'uuid';

/* Chemin de stockage des blocks */
const path = 'src/data/blockchain.json'

/**
 * Mes définitions
 * @typedef { id: string, nom: string, don: number, date: string,hash: string} Block
 * @property {string} id
 * @property {string} nom
 * @property {number} don
 * @property {string} date
 * @property {string} string
 *
 */

/**
 * Renvoie un tableau json de tous les blocks
 * @return {Promise<any>}
 */
export async function findBlocks() {
    try {
        return JSON.parse(await readFile(path, "utf-8"));
    } catch (error) {
        throw new Error("Erreur lors de la lecture du fichier blockchain.json : " + error.message);
    }
}

/**
 * Trouve un block à partir de son id
 * @param partialBlock
 * @return {Promise<Block[]>}
 */
export async function findBlock(partialBlock) {
    // A coder
}

/**
 * Trouve le dernier block de la chaine
 * @return {Promise<Block|null>}
 */
export async function findLastBlock() {
    try {
        const blocks = await findBlocks();
        if (blocks.length === 0) {
            return null; // Aucun block dans la chaîne
        }
        return blocks[blocks.length - 1];
    } catch (error) {
        throw new Error("Erreur lors de la recherche du dernier block : " + error.message);
    }
}

/**
 * Creation d'un block depuis le contenu json
 * @param contenu
 * @return {Promise<Block[]>}
 */
export async function createBlock(contenu) {
    //console.log(contenu.nom, typeof(contenu))
    //const data = JSON.parse(contenu)
    //console.log(data)
    //let idAuto = uuidv4() // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    let blocks;
    try {
        blocks = JSON.parse(await readFile(path, 'utf-8'));
    } catch (error) {
        blocks = [];
    }

    let block = {
        id: uuidv4(),
        nom: contenu.nom,
        don: contenu.don,
        date: getDate(),
        hash: ''
    };

    if (blocks.length > 0) {
        // S'il y a des blocks existants, utilise le hash du dernier block comme référence
        let previousBlockHash = blocks[blocks.length - 1].hash;
        const hashInput = JSON.stringify({ ...blocks[blocks.length - 1], previousBlockHash });
        block.hash = createHash('sha256').update(hashInput).digest('hex');
    }

    blocks.push(block);

    try {
        await writeFile(path, JSON.stringify(blocks, null, 2), 'utf-8');
        return block;
    } catch (error) {
        throw new Error("Erreur lors de l'écriture dans le fichier blockchain.json : " + error.message);
    }
}

