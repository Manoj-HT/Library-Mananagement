import { Component, inject } from '@angular/core';
import { NavService } from '../../navigation/nav-service/nav.service';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api/api.service';

@Component({
  selector: 'book-view',
  standalone: true,
  imports: [],
  templateUrl: './book-view.component.html',
  styleUrl: './book-view.component.scss',
})
export class BookViewComponent {
 private  navService = inject(NavService);
 private router = inject(Router)
 private api = inject(ApiService)

  ngOnInit(): void {
    this.navService.setToolBarState(true);
    console.log(this.router.url);
    this.findRoute()
    this.navService.tools.subscribe({
      next: (res) => {
          if(res.next){
            this.pg1 += 1
            this.pg2 += 1
            this.gotoPage()
            this.navService.resetTools()
          }
          if(res.prev){
            this.pg1 -= 1
            this.pg2 -= 1
            this.gotoPage()
            this.navService.resetTools()
          }
      }
    })
  }

  findRoute(){
    let url = this.router.url
    let str = url.split("/")[3]
    const matches = str.match(/\d+/g);
    let firstNum = 0;
    let seconfNum = 0;
    if (matches && matches.length >= 2) {
      firstNum = parseInt(matches[0]);
      seconfNum = parseInt(matches[1]);
      this.getBookByID(String(firstNum))
  } else {
      console.log("Couldn't find two numbers in the string.");
  }
  }

  bookId!: string;
  studiedState!: string;
  pg1!: number
  pg2!:number
  getBookByID(id: string){
    this.api.getBook(id).subscribe({
      next : (res) => {
        this.bookId = res.id
        this.studiedState = String(res.studiedState)
        this.pg1 = Math.trunc((Number(this.studiedState) / 100) * res.pages.length);
        this.pg2 = this.pg1+1
        this.gotoPage()
      }
    })
  }

  firstPage!: string
  secondPage!: string
  gotoPage(){
    this.api.getPageByPageNumber(this.bookId,this.pg1,this.pg2).subscribe({
      next : (res) => {
        this.firstPage = res.page1
        this.secondPage = res.page2
      }
    })
  }

  ngOnDestroy(): void {
    this.navService.setToolBarState(false);
  }
  book = "Book"
}
