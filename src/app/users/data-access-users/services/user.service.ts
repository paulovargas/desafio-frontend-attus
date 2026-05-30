import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { CreateUser, User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly collectionName = 'users';
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);
  private readonly searchTermSubject = new BehaviorSubject('');

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term.trim().toLowerCase());
  }

  getUsers(): Observable<User[]> {
    return runInInjectionContext(this.injector, () => {
      const usersRef = collection(this.firestore, this.collectionName);

      return collectionData(usersRef, { idField: 'id' }) as Observable<User[]>;
    });
  }

  getFilteredUsers(): Observable<User[]> {
    return combineLatest([this.getUsers(), this.searchTermSubject]).pipe(
      map(([users, searchTerm]) => {
        if (!searchTerm) {
          return users;
        }

        return users.filter((user) => user.name.toLowerCase().includes(searchTerm));
      }),
    );
  }

  addUser(user: CreateUser): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      const usersRef = collection(this.firestore, this.collectionName);

      return addDoc(usersRef, user).then(() => undefined);
    });
  }

  updateUser(id: string, user: CreateUser): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      const userRef = doc(this.firestore, this.collectionName, id);

      return updateDoc(userRef, user);
    });
  }

  deleteUser(id: string): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      const userRef = doc(this.firestore, this.collectionName, id);

      return deleteDoc(userRef);
    });
  }
}
