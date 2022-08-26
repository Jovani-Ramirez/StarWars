import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CharactersService } from 'src/app/services/characters.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  public characters!: any[];
  public charactersSlide!: any[];
  public selectedIndex!: number;
  public charactersLiked!: any[];
  public likeForm!: FormGroup;

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + 1300;
    const max = (document.documentElement.scrollHeight || document.body.scrollHeight);
    if (pos > max) {
      if (this.characterService.load) { return; }
      this.characterService.getCharacters().subscribe((d: any) => {
        this.characters.push(...d.results);
      })
    }
  }

  constructor(
    public characterService: CharactersService,
    public router: Router,
  ) {
    this.likeForm = new FormGroup({
      name: new FormControl('', Validators.required),
      height: new FormControl('', Validators.required),
      mass: new FormControl('', Validators.required),
      birth_year: new FormControl('', Validators.required),
      like: new FormControl(Boolean, Validators.required),
    });
  }

  ngOnInit(): void {
    this.getCharacters();
    this.getlistLikes();
  }

  getlistLikes(): void {
    this.characterService.getLikes().subscribe((d: any) => {
      this.charactersLiked = d;
    });
  }

  deleteLike(character: any): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.characterService.deleteLike(character.id).subscribe((d: any) => {
        this.getlistLikes();
        this.router.navigate(['home']);
      });
    });
  }

  getCharacters(): void {
    this.characterService.getCharacters().subscribe((d: any) => {
      this.characters = d.results;
      this.charactersSlide = d.results;
    })
  }

  like(character: any) {
    const mass = character.mass;
    const name = character.name;
    const height = character.height;
    const birth_year = character.birth_year;
    this.likeForm.controls['name'].setValue(name)
    this.likeForm.controls['mass'].setValue(mass)
    this.likeForm.controls['height'].setValue(height)
    this.likeForm.controls['birth_year'].setValue(birth_year)
    this.likeForm.controls['like'].setValue(true)
    const data = this.likeForm.value;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.characterService.like(data).subscribe((d: any) => {
        this.getlistLikes();
        this.router.navigate(['home']);
      })
    });
  }

}
