import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMensajesComponent } from './chat-mensajes.component';

describe('ChatMensajesComponent', () => {
  let component: ChatMensajesComponent;
  let fixture: ComponentFixture<ChatMensajesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMensajesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatMensajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
