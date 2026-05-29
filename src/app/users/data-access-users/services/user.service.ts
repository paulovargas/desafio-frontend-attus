import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CreateUser, User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly collectionName = 'users';
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);

  getUsers(): Observable<User[]> {
    return runInInjectionContext(this.injector, () => {
      const usersRef = collection(this.firestore, this.collectionName);

      return collectionData(usersRef, { idField: 'id' }) as Observable<User[]>;
    });
  }

  addUser(user: CreateUser): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      const usersRef = collection(this.firestore, this.collectionName);

      return addDoc(usersRef, user).then(() => undefined);
    });
  }
}
