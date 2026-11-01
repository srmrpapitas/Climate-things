import Foundation
import Vision
import CoreImage
import AppKit

let a = CommandLine.arguments
let ci = CIImage(contentsOf: URL(fileURLWithPath: a[1]))!
let handler = VNImageRequestHandler(ciImage: ci)
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
let r = req.results!.first!
let buf = try r.generateMaskedImage(ofInstances: r.allInstances, from: handler, croppedToInstancesExtent: false)
let rep = NSBitmapImageRep(ciImage: CIImage(cvPixelBuffer: buf))
let png = rep.representation(using: NSBitmapImageRep.FileType.png, properties: [:])!
try png.write(to: URL(fileURLWithPath: a[2]))
print("ok", r.allInstances.count)
