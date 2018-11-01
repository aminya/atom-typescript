import {DisposableLike} from "atom"
import {BusySignalService, DatatipService, SignatureHelpRegistry} from "atom/ide"
import {IndieDelegate} from "atom/linter"
import {StatusBar} from "atom/status-bar"
import {SemanticView, SemanticViewSerializationData} from "./atom/views/outline/semanticView"
import {State} from "./packageState"
import {PluginManager} from "./pluginManager"

let pluginManager: PluginManager | undefined

export async function activate(state: State) {
  const pns = atom.packages.getAvailablePackageNames()
  const packagesProvidingUIServices = ["atom-ide-ui", "linter", "nuclide"]
  if (!packagesProvidingUIServices.some(p => pns.includes(p))) {
    // tslint:disable-next-line:no-unsafe-any
    await require("atom-package-deps").install("atom-typescript", true)
  }

  // tslint:disable-next-line:no-unsafe-any
  require("etch").setScheduler(atom.views)

  // tslint:disable-next-line:no-shadowed-variable
  const {PluginManager} = require("./pluginManager") as typeof import("./pluginManager")
  pluginManager = new PluginManager(state)
}

export function deactivate() {
  if (pluginManager) pluginManager.destroy()
  pluginManager = undefined
}

export function serialize() {
  if (pluginManager) return pluginManager.serialize()
  else return undefined
}

export function deserializeSemanticView(serialized: SemanticViewSerializationData): SemanticView {
  const {
    // tslint:disable-next-line:no-unsafe-any no-shadowed-variable
    SemanticView,
  } = require("./atom/views/outline/semanticView") as typeof import("./atom/views/outline/semanticView")
  return SemanticView.create(serialized.data)
}

////////////////////////////////// Consumers ///////////////////////////////////
export function consumeLinter(
  register: (opts: {name: string}) => IndieDelegate,
): DisposableLike | void {
  if (pluginManager) return pluginManager.consumeLinter(register)
}

export function consumeStatusBar(statusBar: StatusBar): DisposableLike | void {
  if (pluginManager) return pluginManager.consumeStatusBar(statusBar)
}

export function consumeDatatipService(datatipService: DatatipService): DisposableLike | void {
  if (pluginManager) return pluginManager.consumeDatatipService(datatipService)
}

export function consumeSignatureHelp(registry: SignatureHelpRegistry): DisposableLike | void {
  if (pluginManager) return pluginManager.consumeSigHelpService(registry)
}

export function consumeBusySignal(busySignalService: BusySignalService): DisposableLike | void {
  if (pluginManager) return pluginManager.consumeBusySignal(busySignalService)
}

////////////////////////////////// Providers ///////////////////////////////////
export function provideAutocomplete() {
  if (pluginManager) return pluginManager.provideAutocomplete()
}

export function provideIntentions() {
  if (pluginManager) return pluginManager.provideIntentions()
}

export function provideCodeActions() {
  if (pluginManager) return pluginManager.provideCodeActions()
}

export function provideHyperclick() {
  if (pluginManager) return pluginManager.provideHyperclick()
}
