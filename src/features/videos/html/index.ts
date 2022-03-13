import { CompositionInterface, HTMLMethod, HTMLOptions, LayerAttribute } from 'constant'
import { VisualMedia } from 'features/videos/visualMedia'
import { validateLayerHTML, withValidation } from 'utils'

export class HTML extends VisualMedia {
  constructor({ composition, id }: { composition: CompositionInterface; id: string }) {
    super({ composition, id })
  }

  public [HTMLMethod.setHTMLOptions](html?: HTMLOptions): this | void {
    withValidation<this>(
      () => validateLayerHTML(HTMLMethod.setHTMLOptions, { [LayerAttribute.html]: html }),
      () => this._updateAttribute(LayerAttribute.html, html)
    )
  }
}
