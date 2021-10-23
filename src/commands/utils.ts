import { collection, doc, getDoc } from 'firebase/firestore'
import { firestore } from '../database/firestore'

const getCommandsCollection = () => {
  return collection(firestore, 'commands');
}

const getCommandSnapshot = async command => {
  const docRef = doc(firestore, 'commands', command);
  const docSnap = await getDoc(docRef);

  return docSnap;
}

const getCommandData = async command => {
  const docRef = doc(firestore, 'commands', command);
  const docSnap = await getDoc(docRef);

  return docSnap.data();
}

export {
  getCommandsCollection,
  getCommandSnapshot,
  getCommandData
};
