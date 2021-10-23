import { deleteDoc, doc, setDoc } from '@firebase/firestore';
import { firestore } from './firestore';

const setDocument = async (path, data) => {
  await setDoc(doc(firestore, path), data);
}

const deleteDocument = async path => {
  await deleteDoc(doc(firestore, path));
}

export {
  setDocument,
  deleteDocument
};
