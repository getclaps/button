import { LitElement } from "lit-element";

const refCountMap = new Map<any, number>();

const ref = Symbol('refCountKey');

export class ConnectedCountElement extends LitElement  {
  connectedCountKey?: any;
  allDisconnectedCallback() {};

  private [ref]!: any;

  connectedCallback() {
    super.connectedCallback();

    this[ref] = this.connectedCountKey ?? this;

    refCountMap.set(
      this[ref], 
      1 + (refCountMap.get(this[ref]) || 0),
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    const refCount = (refCountMap?.get(this[ref]) || 0) - 1;
    if (refCount > 0) {
      refCountMap.set(this[ref], refCount);
    } else {
      refCountMap.delete(this[ref]);
      this.allDisconnectedCallback?.();
    }
  }
}
