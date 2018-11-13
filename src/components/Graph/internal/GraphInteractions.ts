import Plottable, { Point } from 'plottable'
import { GuideLineLayer } from 'plottable/build/src/components'
import GraphTooltip from 'src/components/Graph/internal/GraphTooltip'
import {
  GraphComponents,
  PurePlotsToRender,
  StackGraphComponents,
} from 'src/components/Graph/internal/types'

const hideGuideline = (guideline: GuideLineLayer<{}>) => guideline.addClass('hide')

const removeInteraction = ({ dots, guideline, tooltip }: GraphComponents) => {
  if (dots) {
    dots.datasets([new Plottable.Dataset()])
  }
  hideGuideline(guideline)
  tooltip.hide()
}

const updateInteraction = (p: Point, components: GraphComponents) => {
  if (!components.plot) return

  const point = components.plot.entityNearestByXThenY(p)

  if (point) {
    const { dataset, datum } = point

    if (components.dots) {
      components.dots.datasets()[0].data([datum])
      components.dots.attr('class', `graph-dot ${dataset.metadata().className}`)
    }

    components.guideline.value(datum[0]).removeClass('hide')

    components.tooltip.update(
      components.plot.content().style('width'),
      components.plot.content().style('height'),
      point.position.x,
      point.position.y,
      datum[1],
      dataset.metadata()
    )
  }
}

const updateStackInteraction = (p: Point, components: StackGraphComponents) => {
  if (!components.plots.length) return

  const points = components.plots.map(plot => plot.entityNearestByXThenY(p))

  if (points) {
    if (components.dots.length) {
      components.dots.forEach((dots, i) => {
        // Since stack graphs have not max values, they will always have only one dataset
        // so, using the first dataset as reference will work
        dots.datasets()[0].data([points[i].datum])
        dots.attr('class', `graph-dot ${points[i].dataset.metadata().className}`)
      })
    }

    components.guideline.value(points[0].datum[0]).removeClass('hide')

    // Since all graph in a stack graph share the same space, attaching the tooltip to any plot will work
    components.tooltip.update(
      components.plots[0].content().style('width'),
      components.plots[0].content().style('height'),
      points[0].position.x,
      points[0].position.y,
      points
    )
  }
}

const updateSyncInteraction = (p: Point, graphComponents: GraphComponents[]) => {
  graphComponents.forEach(components => {
    updateInteraction(p, components)
  })
}

export const addSyncPointerInteraction = (
  plotToAttach: PurePlotsToRender,
  graphComponents: GraphComponents[]
) => {
  const interaction = new Plottable.Interactions.Pointer()

  const onPointerMove = (p: Point) => {
    if (p) {
      updateSyncInteraction(p, graphComponents)
    }
  }

  interaction.onPointerMove(onPointerMove)

  interaction.onPointerExit(() => {
    graphComponents.forEach(removeInteraction)
  })

  interaction.attachTo(plotToAttach)
}

export const addPointerInteraction = (components: GraphComponents) => {
  const interaction = new Plottable.Interactions.Pointer()

  interaction.onPointerMove(pointer => {
    updateInteraction(pointer, components)
  })

  interaction.onPointerExit(() => {
    removeInteraction(components)
  })

  interaction.attachTo(components.plot)
}

export const addStackPointerInteraction = (components: StackGraphComponents) => {
  const interaction = new Plottable.Interactions.Pointer()

  interaction.onPointerMove(pointer => {
    updateStackInteraction(pointer, components)
  })

  interaction.onPointerExit(() => {
    components.plots.forEach((plot, i) =>
      removeInteraction({
        dots: components.dots[i],
        guideline: components.guideline,
        tooltip: (components.tooltip as any) as GraphTooltip,
        plot,
      })
    )
  })

  interaction.attachTo(components.plots[0])
}
