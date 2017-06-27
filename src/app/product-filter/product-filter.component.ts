import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { Category } from '../category';
import { CategoryService } from '../category.service';
import { User } from '../user';
import { UserService } from '../user.service';
import { ProductFilter } from '../product-filter';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnDestroy, OnInit {

  @Output() onSearch: EventEmitter<ProductFilter> = new EventEmitter();

  productFilter: ProductFilter = {};
  categories: Category[];
  users: User[];

  private _categoriesSubscription: Subscription;
  private _usersSubscription: Subscription;

  constructor(
    private _categoryService: CategoryService,
    private _userService: UserService) { }

  ngOnInit(): void {
    this._categoriesSubscription = this._categoryService
      .getCategories()
      .subscribe((data: Category[]) => this.categories = data);
    
    this._usersSubscription = this._userService
      .getUsers()
      .subscribe((data: User[]) => this.users = data);

  }

  ngOnDestroy(): void {
    this._categoriesSubscription.unsubscribe();
    this._usersSubscription.unsubscribe();
  }

  notifyHost(): void {
    this.onSearch.emit(this.productFilter);
  }

}
