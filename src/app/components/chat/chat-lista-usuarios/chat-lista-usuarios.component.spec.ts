import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatListaUsuariosComponent } from './chat-lista-usuarios.component';

describe('ChatListaUsuariosComponent', () => {
  let component: ChatListaUsuariosComponent;
  let fixture: ComponentFixture<ChatListaUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatListaUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatListaUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
