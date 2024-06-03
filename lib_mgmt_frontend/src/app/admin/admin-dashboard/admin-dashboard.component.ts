import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../shared/services/api/api.service';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
 private api = inject(ApiService)
 details= {
  totalusers : 23,
  totalBooks : 400
 }
 ngOnInit(): void {
    this.api.getDashboardDetails().subscribe({
      next : (res) => {
        this.details={
          totalBooks : res[0].length,
          totalusers : res[1].length
        }
      }
    })  
 }
}
