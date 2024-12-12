import type { TPointerEvent } from "fabric"

type PresetObjectName = "PrintAreaText" | "ProductMockup" | "PrintAreaGrid"

declare module "fabric" {
  // to have the properties recognized on the instance and in the constructor
  interface FabricObject {
    id?: string
    name?: PresetObjectName
  }

  // to have the properties typed in the exported object
  interface SerializedObjectProps {
    id?: string
    name?: PresetObjectName
  }

  interface Canvas {
    __customEvents?: {
      "mouse:down"?: (e: TPointerEventInfo<TPointerEvent>) => void
      "mouse:move"?: (e: TPointerEventInfo<TPointerEvent>) => void
      "mouse:up"?: (e: TPointerEventInfo<TPointerEvent>) => void
    }
  }

  // 如果需要扩展事件类型
  interface TPointerEventInfo {
    absolutePointer: Point
    button?: number
    isClick?: boolean
    pointer: Point
    target?: FabricObject
    transform?: Transform
  }
}
