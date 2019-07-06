
/**
 * DeviceState is returned by DeviceManager.getDeviceState, and allows getting/setting of a device provided by a DeviceProvider.
 */
export interface DeviceState {
  component?: string;
  interfaces?: string[];
  metadata?: any;
  name?: string;
  room?: string;
  type?: ScryptedDeviceType;
  on?: boolean;
  brightness?: number;
  colorTemperature?: number;
  rgb?: ColorRgb;
  hsv?: ColorHsv;
  paused?: boolean;
  running?: boolean;
  docked?: boolean;
  /**
   * Get the ambient temperature in Celsius.
   */
  temperature?: number;
  /**
   * Get the user facing unit of measurement for this thermometer. Note that while this may be Fahrenheit, getTemperatureAmbient will return the temperature in Celsius.
   */
  temperatureUnit?: TemperatureUnit;
  humidity?: number;
  thermostatAvailableModes?: ThermostatMode[];
  thermostatMode?: ThermostatMode;
  thermostatSetpoint?: number;
  thermostatSetpointHigh?: number;
  thermostatSetpointLow?: number;
  lockState?: LockState;
  passwords?: string[];
  entryOpen?: boolean;
  batteryLevel?: number;
  online?: boolean;
  updateAvailable?: boolean;
  fromMimeType?: string;
  toMimeType?: string;
  binaryState?: boolean;
  intrusionDetected?: boolean;
  motionDetected?: boolean;
  occupied?: boolean;
  flooded?: boolean;
  ultraviolet?: number;
  luminance?: number;
  settings?: Setting[];
}
/**
 * All devices in Scrypted implement ScryptedDevice, which contains the id, name, and type. Add listeners to subscribe to events from that device.
 */
export interface ScryptedDevice {
  /**
   * Subscribe to events from a specific interface on a device, such as 'OnOff' or 'Brightness'.
   */
  listen(event: ScryptedInterface|EventListenerOptions, callback: (eventSource: ScryptedDevice|null, eventDetails: EventDetails, eventData: object) => void): EventListenerRegister;

  setName(name: string): void;

  setRoom(arg0: string): void;

  setType(type: ScryptedDeviceType): void;

  component?: string;
  id?: string;
  interfaces?: string[];
  metadata?: any;
  name?: string;
  room?: string;
  type?: ScryptedDeviceType;
}
export interface EventListenerOptions {
  /**
   * This EventListener will denoise events, and will not be called unless the state changes.
   */
  denoise?: boolean;
  /**
   * The EventListener will subscribe to this event interface.
   */
  event?: ScryptedInterface;
  /**
   * This EventListener will passively watch for events, and not initiate polling.
   */
  watch?: boolean;
}
/**
 * Returned when an event listener is attached to an EventEmitter. Call removeListener to unregister from events.
 */
export interface EventListenerRegister {
  removeListener(): void;

}
export enum ScryptedDeviceType {
  Builtin = "Builtin",
  Camera = "Camera",
  Fan = "Fan",
  Light = "Light",
  Switch = "Switch",
  Outlet = "Outlet",
  Sensor = "Sensor",
  Scene = "Scene",
  Program = "Program",
  Automation = "Automation",
  Vacuum = "Vacuum",
  Notifier = "Notifier",
  Thermostat = "Thermostat",
  Lock = "Lock",
  PasswordControl = "PasswordControl",
  Display = "Display",
  Speaker = "Speaker",
  Event = "Event",
  Entry = "Entry",
  Garage = "Garage",
  DeviceProvider = "DeviceProvider",
  DataSource = "DataSource",
  API = "API",
  Unknown = "Unknown",
}
/**
 * OnOff is a basic binary switch.
 */
export interface OnOff {
  turnOff(): void;

  turnOn(): void;

  on?: boolean;
}
/**
 * Brightness is a lighting device that can be dimmed/lit between 0 to 100.
 */
export interface Brightness {
  setBrightness(brightness: number): void;

  brightness?: number;
}
/**
 * ColorSettingTemperature sets the color temperature of a light in Kelvin.
 */
export interface ColorSettingTemperature {
  getTemperatureMaxK(): number;

  getTemperatureMinK(): number;

  setTemperature(kelvin: number): void;

  colorTemperature?: number;
}
/**
 * ColorSettingRgb sets the color of a colored light using the RGB representation.
 */
export interface ColorSettingRgb {
  setRgb(r: number, g: number, b: number): void;

  rgb?: ColorRgb;
}
/**
 * Represents an RGB color with component values between 0 and 255.
 */
export interface ColorRgb {
  b?: number;
  g?: number;
  r?: number;
}
/**
 * ColorSettingHsv sets the color of a colored light using the HSV representation.
 */
export interface ColorSettingHsv {
  setHsv(hue: number, saturation: number, value: number): void;

  hsv?: ColorHsv;
}
/**
 * Represents an HSV color value component.
 */
export interface ColorHsv {
  /**
   * Hue. 0 to 360.
   */
  h?: number;
  /**
   * Saturation. 0 to 1.
   */
  s?: number;
  /**
   * Value. 0 to 1.
   */
  v?: number;
}
/**
 * Notifier can be any endpoint that can receive messages, such as speakers, phone numbers, messaging clients, etc. The messages may optionally contain media.
 */
export interface Notifier {
  /**
   * If a the media parameter is supplied, the mime type denotes how to send the media within notification. For example, specify 'image/*' to send a video MediaObject as an image.
Passing null uses the native type of the MediaObject. If that is not supported by the notifier, the media will be converted to a compatible type.
   */
  sendNotification(title: string, body: string, media: URL|MediaObject, mimeType: string): void;

}
/**
 * MediaObject is an intermediate object within Scrypted to represent all media objects. Plugins should use the MediaConverter to convert the Scrypted MediaObject into a desired type, whether it is a externally accessible URL, a Buffer, etc.
 */
export interface MediaObject {
  mimeType?: string;
}
/**
 * StartStop represents a device that can be started, stopped, and possibly paused and resumed. Typically vacuum cleaners or washers.
 */
export interface StartStop {
  isPausable(): boolean;

  pause(): void;

  resume(): void;

  start(): void;

  stop(): void;

  paused?: boolean;
  running?: boolean;
}
/**
 * Dock instructs devices that have a base station or charger, to return to their home.
 */
export interface Dock {
  dock(): void;

  docked?: boolean;
}
/**
 * TemperatureSetting represents a thermostat device.
 */
export interface TemperatureSetting extends Thermometer, HumiditySensor {
  setThermostatMode(mode: ThermostatMode): void;

  setThermostatSetpoint(degrees: number): void;

  setThermostatSetpointHigh(high: number): void;

  setThermostatSetpointLow(low: number): void;

  thermostatAvailableModes?: ThermostatMode[];
  thermostatMode?: ThermostatMode;
  thermostatSetpoint?: number;
  thermostatSetpointHigh?: number;
  thermostatSetpointLow?: number;
}
export interface Thermometer {
  /**
   * Get the ambient temperature in Celsius.
   */
  temperature?: number;
  /**
   * Get the user facing unit of measurement for this thermometer. Note that while this may be Fahrenheit, getTemperatureAmbient will return the temperature in Celsius.
   */
  temperatureUnit?: TemperatureUnit;
}
export enum TemperatureUnit {
  C = "C",
  F = "F",
}
export interface HumiditySensor {
  humidity?: number;
}
export enum ThermostatMode {
  Off = "Off",
  Cool = "Cool",
  Heat = "Heat",
  HeatCool = "HeatCool",
  Auto = "Auto",
  FanOnly = "FanOnly",
  Purifier = "Purifier",
  Eco = "Eco",
  Dry = "Dry",
  On = "On",
}
/**
 * Camera devices can take still photos.
 */
export interface Camera {
  takePicture(): MediaObject;

}
/**
 * VideoCamera devices can capture video streams.
 */
export interface VideoCamera {
  getVideoStream(): MediaObject;

}
/**
 * Lock controls devices that can lock or unlock entries. Often works in tandem with PasswordControl.
 */
export interface Lock {
  lock(): void;

  unlock(): void;

  lockState?: LockState;
}
export enum LockState {
  Locked = "Locked",
  Unlocked = "Unlocked",
  Jammed = "Jammed",
}
/**
 * PasswordControl represents devices that authorize users via a passcode or pin code.
 */
export interface PasswordStore extends Authenticator {
  addPassword(password: string): void;

  removePassword(password: string): void;

  passwords?: string[];
}
/**
 * Authenticator can be used to require a password before allowing interaction with a security device.
 */
export interface Authenticator {
  checkPassword(password: string): boolean;

}
/**
 * Scenes control multiple different devices into a given state.
 */
export interface Scene {
  activate(): void;

  deactivate(): void;

  /**
   * If a scene can be reversed, isReversible should return true. Otherwise deactivate will not be called.
   */
  isReversible(): boolean;

}
/**
 * Entry represents devices that can open and close barriers, such as garage doors.
 */
export interface Entry extends EntrySensor {
  closeEntry(): void;

  openEntry(): void;

}
export interface EntrySensor {
  entryOpen?: boolean;
}
/**
 * DeviceProvider acts as a controller/hub and exposes multiple devices to Scrypted Device Manager.
 */
export interface DeviceProvider {
  /**
   * Initiate device discovery for the specified duration.
   */
  discoverDevices(duration: number): void;

  /**
   * Get an instance of a previously discovered device that was reported to the device manager.
   */
  getDevice(nativeId: string): object;

}
export interface Alarm {
  getClockType(): ClockType;

  getHour(): number;

  getMinute(): number;

  isEnabled(day: number): boolean;

}
export enum ClockType {
  AM = "AM",
  PM = "PM",
  TwentyFourHourClock = "TwentyFourHourClock",
  BeforeSunrise = "BeforeSunrise",
  AfterSunrise = "AfterSunrise",
  BeforeSunset = "BeforeSunset",
  AfterSunset = "AfterSunset",
}
/**
 * Battery retrieves the battery level of battery powered devices.
 */
export interface Battery {
  batteryLevel?: number;
}
/**
 * Refresh indicates that this device has properties that are not automatically updated, and must be periodically refreshed via polling. Device implementations should never implement their own underlying polling algorithm, and instead implement Refresh to allow Scrypted to manage polling intelligently.
 */
export interface Refresh {
  /**
   * Get the recommended refresh/poll frequency in seconds for this device.
   */
  getRefreshFrequency(): number;

  /**
   * This method is called by Scrypted when the properties of the device need to be refreshed. When the device has completed the refresh, the appropriate DeviceState properties should be set. The parameters provide the specific interface that needs to be refreshed and whether it was user initiated (via UI or voice).
   */
  refresh(refreshInterface: string, userInitiated: boolean): void;

}
/**
 * MediaPlayer allows media playback on screen or speaker devices, such as Chromecasts or TVs.
 */
export interface MediaPlayer {
  load(media: URL|MediaObject, options: MediaPlayerOptions): void;

  pause(): void;

  play(): void;

  stop(): void;

}
export interface MediaPlayerOptions {
  autoplay?: boolean;
  mimeType?: string;
}
/**
 * Online denotes whether the device is online or unresponsive. It may be unresponsive due to being unplugged, network error, etc.
 */
export interface Online {
  online?: boolean;
}
export interface Program {
  /**
   * Synchronously run a script given the provided arguments.
   */
  run(args: object[]): object;

  /**
   * Asynchronously run a script given the provided arguments.
   */
  runAsync(args: object[]): Promise<object>;

}
/**
 * SoftwareUpdate provides a way to check for updates and install them. This may be a Scrypted Plugin or device firmware.
 */
export interface SoftwareUpdate {
  checkForUpdate(): void;

  installUpdate(): void;

  updateAvailable?: boolean;
}
/**
 * Add a converter to be used by Scrypted to convert buffers from one mime type to another mime type.
 */
export interface BufferConverter {
  convert(buffer: Buffer, fromMimeType: string): Promise<Buffer>;

  fromMimeType?: string;
  toMimeType?: string;
}
export interface BinarySensor {
  binaryState?: boolean;
}
export interface IntrusionSensor {
  intrusionDetected?: boolean;
}
export interface AudioSensor {
}
export interface MotionSensor {
  motionDetected?: boolean;
}
export interface OccupancySensor {
  occupied?: boolean;
}
export interface FloodSensor {
  flooded?: boolean;
}
export interface UltravioletSensor {
  ultraviolet?: number;
}
export interface LuminanceSensor {
  luminance?: number;
}
export interface EventListener {
  /**
   * This device type can be hooked by Automation actions to handle events. The event source, event details (interface, time, property), and event data are all passed to the listener as arguments.
   */
  onEvent(eventSource: ScryptedDevice|null, eventDetails: EventDetails, eventData: object): void;

}
export interface EventDetails {
  changed?: boolean;
  eventInterface?: string;
  eventTime?: number;
  property?: string;
}
/**
 * Logger is exposed via log.* to allow writing to the Scrypted log.
 */
export interface Logger {
  /**
   * Alert. Alert level logs will be displayed as a notification in the management console.
   */
  a(msg: string): void;

  /**
   * Clear the log
   */
  clear(): void;

  /**
   * Clear a specific alert
   */
  clearAlert(msg: string): void;

  /**
   * Clear all alerts
   */
  clearAlerts(): void;

  /**
   * Debug
   */
  d(msg: string): void;

  /**
   * Error
   */
  e(msg: string): void;

  /**
   * Info
   */
  i(msg: string): void;

  /**
   * Verbose
   */
  v(msg: string): void;

  /**
   * Warn
   */
  w(msg: string): void;

}
export interface MediaSource {
  /**
   * Get a MediaObject that will be automatically converted for playback on other devices.
   */
  getMedia(): MediaObject;

}
export interface MessagingEndpoint {
}
/**
 * Settings viewing and editing of device configurations that describe or modify behavior.
 */
export interface Settings {
  getSetting(key: string): boolean|number|string;

  putSetting(key: string, value: boolean|number|string): void;

  settings?: Setting[];
}
export interface Setting {
  choices?: string[];
  description?: string;
  key?: string;
  placeholder?: string;
  readonly?: boolean;
  title?: string;
  type?: string;
  value?: boolean|number|string;
}
/**
 * The OauthClient can be implemented to perform the browser based Oauth process from within a plugin.
 */
export interface OauthClient {
  /**
   * Get the Oauth URL to navigate to in the browser. The redirect_uri parameter is not needed and will be automatically set by Scrypted.
   */
  getOauthUrl(): string;

  /**
   * When an oauth request by a plugin completes, the callback url, with the code/token, will be passed to this method.
   */
  onOauthCallback(callbackUrl: string): void;

}
export interface MediaManager {
  /**
   * Convert a media object to a Buffer of the given mime type.
   */
  convertMediaObjectToBuffer(mediaObject: MediaObject, toMimeType: string): Promise<Buffer>;

  /**
   * Convert a media object to a locally accessible uri that serves a media file of the given mime type.
   */
  convertMediaObjectToLocalUri(mediaObject: MediaObject, toMimeType: string): Promise<string>;

  /**
   * Convert a media object to a publically accessible uri that serves a media file of the given mime type.
   */
  convertMediaObjectToUri(mediaObject: MediaObject, toMimeType: string): Promise<string>;

  /**
   * Create a MediaObject. The media will be created from the provided FFmpeg input arguments.
   */
  createFFmpegMediaObject(ffMpegInput: FFMpegInput): MediaObject;

  /**
   * Create a MediaObject. The mime type needs to be provided up front, but the data can be a Uri string, Buffer, or a Promise for a Uri string or Buffer.
   */
  createMediaObject(data: string|Buffer|Promise<string|Buffer>, mimeType: string): MediaObject;

}
export interface FFMpegInput {
  inputArguments?: string[];
}
/**
 * DeviceManager is the interface used by DeviceProvider to report new devices, device states, and device events to Scrypted.
 */
export interface DeviceManager {
  /**
   * Get the logger for a device given a native id.
   */
  getDeviceLogger(nativeId: string): Logger;

  /**
   * Get the device state maintained by Scrypted. Setting properties on this state will update the state in Scrypted.
   */
  getDeviceState(): DeviceState;

  /**
   * Get the device state maintained by Scrypted. Setting properties on this state will update the state in Scrypted.
   */
  getDeviceState(nativeId: string): DeviceState;

  /**
   * Get the per script Storage object.
   */
  getDeviceStorage(): Storage;

  /**
   * Get the per device Storage object.
   */
  getDeviceStorage(nativeId: string): Storage;

  getNativeIds(): string[];

  /**
   * onDeviceDiscovered is used to report new devices that are trickle discovered, one by one, such as via a network broadcast.
   */
  onDeviceDiscovered(device: Device): void;

  /**
   * Fire an event for this plugin's device.
   */
  onDeviceEvent(eventInterface: string, eventData: any): void;

  /**
   * Fire an event for a device provided by this plugin.
   */
  onDeviceEvent(nativeId: string, eventInterface: string, eventData: any): void;

  /**
   * onDevicesChanged is used to sync Scrypted with devices that are attached to a hub, such as Hue or SmartThings. All the devices should be reported at once.
   */
  onDevicesChanged(devices: DeviceManifest): void;

}
/**
 * Device objects are created by DeviceProviders when new devices are discover and synced to Scrypted via the DeviceManager.
 */
export interface Device {
  interfaces?: string[];
  model?: string;
  name?: string;
  /**
   * The native id that is used by the DeviceProvider used to internally identify provided devices.
   */
  nativeId?: string;
  room?: string;
  type?: ScryptedDeviceType;
}
/**
 * DeviceManifest is passed to DeviceManager.onDevicesChanged to sync a full list of devices from the controller/hub (Hue, SmartThings, etc)
 */
export interface DeviceManifest {
  devices?: Device[];
}
/**
 * EndpointManager provides publicly accessible URLs that can be used to contact your Scrypted Plugin.
 */
export interface EndpointManager {
  /**
   * Get an URL that can only be accessed on your local network by anyone with the link. HTTP requests and responses are without any encyption. Plugin implementation is responsible for authentication.
   */
  getInsecurePublicLocalEndpoint(): string;

  /**
   * Get an URL that can be externally accessed by anyone with the link. Plugin implementation is responsible for authentication.
   */
  getPublicCloudEndpoint(): Promise<string>;

  /**
   * Get an URL that can only be accessed on your local network by anyone with the link. HTTP requests and responses are over SSL with a self signed certificate. Plugin implementation is responsible for authentication.
   */
  getPublicLocalEndpoint(): string;

  /**
   * Get an URL that can be used to send a push message to the client. This differs from a cloud endpoint, in that, the Plugin does not send a response back. Plugin implementation is responsible for authentication.
   */
  getPublicPushEndpoint(): Promise<string>;

}
/**
 * SystemManager is used by scripts to query device state and access devices.
 */
export interface SystemManager {
  /**
   * Find a Scrypted device by id.
   */
  getDeviceById(id: string): ScryptedDevice|null;

  /**
   * Find a Scrypted device by name.
   */
  getDeviceByName(name: string): ScryptedDevice|null;

  /**
   * Get the current state of a device.
   */
  getDeviceState(id: string): any;

  /**
   * Get the current state of every device.
   */
  getSystemState(): any;

  /**
   * Passively (without polling) listen to property changed events.
   */
  listen(callback: (eventSource: ScryptedDevice|null, eventDetails: EventDetails, eventData: object) => void): EventListenerRegister;

}
/**
 * Android provides limited access to the Android system, to send Intents to other applications, such as Tasker. See Android SDK documentation for more information.
 */
export interface Android {
  /**
   * Create a new Intent. Use one of the send methods to send broadcasts, start activities, or start services.
   */
  newIntent(): Intent;

  sendBroadcast(intent: Intent): void;

  startActivity(intent: Intent): void;

  startService(intent: Intent): void;

}
/**
 * The HttpRequestHandler allows handling of web requests under the endpoint path: /endpoint/npm-package-name/*.
 */
export interface HttpRequestHandler {
  /**
   * Get the preferred endpoint of this HttpRequestHandler. Local/development scripts can set this to any value. This is ignored if the plugin is installed via npm: the endpoint will always be the npm package name.
   */
  getEndpoint(): string;

  /**
   * Callback to handle an incoming request.
   */
  onRequest(request: HttpRequest, response: HttpResponse): void;

}
export interface HttpRequest {
  body?: string;
  headers?: object;
  isPublicEndpoint?: boolean;
  method?: string;
  rootPath?: string;
  url?: string;
}
/**
 * Response object provided by the HttpRequestHandler.
 */
export interface HttpResponse {
  send(options: HttpResponseOptions, body: string): void;

  send(options: HttpResponseOptions, body: Buffer): void;

  send(body: string): void;

  send(body: Buffer): void;

  sendFile(options: HttpResponseOptions, path: string): void;

  sendFile(path: string): void;

}
export interface HttpResponseOptions {
  asContent?: boolean;
  code?: number;
  headers?: object;
}
export interface EngineIOHandler {
  /**
   * Get the preferred endpoint of this HttpRequestHandler. Local/development scripts can set this to any value. This is ignored if the plugin is installed via npm: the endpoint will always be the npm package name.
   */
  getEndpoint(): string;

  onConnection(request: HttpRequest, webSocketUrl: string): void;

}
export interface PushHandler {
  /**
   * Get the preferred endpoint of this HttpRequestHandler. Local/development scripts can set this to any value. This is ignored if the plugin is installed via npm: the endpoint will always be the npm package name.
   */
  getEndpoint(): string;

  /**
   * Callback to handle an incoming push.
   */
  onPush(request: HttpRequest): void;

}
export interface ZwaveManager {
  getNodeManufacturerName(homeId: number, nodeId: number): string;

  getNodeName(homeId: number, nodeId: number): string;

  getNodeProductName(homeId: number, nodeId: number): string;

  getValue(valueId: ZwaveValueId): string;

  getValueHelp(valueId: ZwaveValueId): string;

  getValueLabel(valueId: ZwaveValueId): string;

  getValueListItems(valueId: ZwaveValueId): string[];

  getValueListValues(valueId: ZwaveValueId): number[];

  getValueUnit(valueId: ZwaveValueId): string;

  refreshValue(valueId: ZwaveValueId): void;

  setNodeName(homeId: number, nodeId: number, name: string): void;

  setValue(valueId: ZwaveValueId, value: string): void;

  setValueRaw(valueId: ZwaveValueId, value: Buffer): void;

}
export interface ZwaveValueId {
  commandClass?: number;
  genre?: number;
  homeId?: number;
  index?: number;
  instance?: number;
  nodeId?: number;
  type?: number;
}
export interface ZwaveNotification {
  byteData?: number;
  event?: number;
  type?: ZwaveNotificationType;
  valueId?: ZwaveValueId;
}
export enum ZwaveNotificationType {
  Type_ValueAdded = "Type_ValueAdded",
  Type_ValueRemoved = "Type_ValueRemoved",
  Type_ValueChanged = "Type_ValueChanged",
  Type_ValueRefreshed = "Type_ValueRefreshed",
  Type_Group = "Type_Group",
  Type_NodeNew = "Type_NodeNew",
  Type_NodeAdded = "Type_NodeAdded",
  Type_NodeRemoved = "Type_NodeRemoved",
  Type_NodeProtocolInfo = "Type_NodeProtocolInfo",
  Type_NodeNaming = "Type_NodeNaming",
  Type_NodeEvent = "Type_NodeEvent",
  Type_PollingDisabled = "Type_PollingDisabled",
  Type_PollingEnabled = "Type_PollingEnabled",
  Type_SceneEvent = "Type_SceneEvent",
  Type_CreateButton = "Type_CreateButton",
  Type_DeleteButton = "Type_DeleteButton",
  Type_ButtonOn = "Type_ButtonOn",
  Type_ButtonOff = "Type_ButtonOff",
  Type_DriverReady = "Type_DriverReady",
  Type_DriverFailed = "Type_DriverFailed",
  Type_DriverReset = "Type_DriverReset",
  Type_EssentialNodeQueriesComplete = "Type_EssentialNodeQueriesComplete",
  Type_NodeQueriesComplete = "Type_NodeQueriesComplete",
  Type_AwakeNodesQueried = "Type_AwakeNodesQueried",
  Type_AllNodesQueriedSomeDead = "Type_AllNodesQueriedSomeDead",
  Type_AllNodesQueried = "Type_AllNodesQueried",
  Type_Notification = "Type_Notification",
  Type_DriverRemoved = "Type_DriverRemoved",
  Type_ControllerCommand = "Type_ControllerCommand",
  Type_NodeReset = "Type_NodeReset",
  Type_UserAlerts = "Type_UserAlerts",
  Type_ManufacturerSpecificDBReady = "Type_ManufacturerSpecificDBReady",
}

export class ScryptedDeviceBase implements DeviceState {
  _nativeId: string;
  log: Logger;
  storage: Storage;
  constructor(nativeId?: string);
  component?: string;
  interfaces?: string[];
  metadata?: any;
  name?: string;
  room?: string;
  type?: ScryptedDeviceType;
  on?: boolean;
  brightness?: number;
  colorTemperature?: number;
  rgb?: ColorRgb;
  hsv?: ColorHsv;
  paused?: boolean;
  running?: boolean;
  docked?: boolean;
  /**
   * Get the ambient temperature in Celsius.
   */
  temperature?: number;
  /**
   * Get the user facing unit of measurement for this thermometer. Note that while this may be Fahrenheit, getTemperatureAmbient will return the temperature in Celsius.
   */
  temperatureUnit?: TemperatureUnit;
  humidity?: number;
  thermostatAvailableModes?: ThermostatMode[];
  thermostatMode?: ThermostatMode;
  thermostatSetpoint?: number;
  thermostatSetpointHigh?: number;
  thermostatSetpointLow?: number;
  lockState?: LockState;
  passwords?: string[];
  entryOpen?: boolean;
  batteryLevel?: number;
  online?: boolean;
  updateAvailable?: boolean;
  fromMimeType?: string;
  toMimeType?: string;
  binaryState?: boolean;
  intrusionDetected?: boolean;
  motionDetected?: boolean;
  occupied?: boolean;
  flooded?: boolean;
  ultraviolet?: number;
  luminance?: number;
  settings?: Setting[];
}

export enum ScryptedInterface {
  OnOff = "OnOff",
  Brightness = "Brightness",
  ColorSettingTemperature = "ColorSettingTemperature",
  ColorSettingRgb = "ColorSettingRgb",
  ColorSettingHsv = "ColorSettingHsv",
  Notifier = "Notifier",
  StartStop = "StartStop",
  Dock = "Dock",
  TemperatureSetting = "TemperatureSetting",
  Thermometer = "Thermometer",
  HumiditySensor = "HumiditySensor",
  Camera = "Camera",
  VideoCamera = "VideoCamera",
  Lock = "Lock",
  PasswordStore = "PasswordStore",
  Authenticator = "Authenticator",
  Scene = "Scene",
  Entry = "Entry",
  EntrySensor = "EntrySensor",
  DeviceProvider = "DeviceProvider",
  Alarm = "Alarm",
  Battery = "Battery",
  Refresh = "Refresh",
  MediaPlayer = "MediaPlayer",
  Online = "Online",
  SoftwareUpdate = "SoftwareUpdate",
  BufferConverter = "BufferConverter",
  BinarySensor = "BinarySensor",
  IntrusionSensor = "IntrusionSensor",
  AudioSensor = "AudioSensor",
  MotionSensor = "MotionSensor",
  OccupancySensor = "OccupancySensor",
  FloodSensor = "FloodSensor",
  UltravioletSensor = "UltravioletSensor",
  LuminanceSensor = "LuminanceSensor",
  MediaSource = "MediaSource",
  MessagingEndpoint = "MessagingEndpoint",
  Settings = "Settings",
  OauthClient = "OauthClient",
  Android = "Android",
  HttpRequestHandler = "HttpRequestHandler",
  EngineIOHandler = "EngineIOHandler",
  PushHandler = "PushHandler",
}

export interface ZwaveManagerDevice extends ZwaveManager, ScryptedDevice {
}

/**
 * Android Intent.
 * See: https://developer.android.com/reference/android/content/Intent
 */
interface Intent {
}

declare const ScryptedInterfaceDescriptors: any;
export {
    ScryptedInterfaceDescriptors
}

export interface ScryptedStatic {
    log?: Logger,
    scriptSettings?: Settings,

    android?: Android,
    deviceManager?: DeviceManager,
    endpointManager?: EndpointManager,
    mediaManager?: MediaManager,
    systemManager: SystemManager,
    zwaveManager?: ZwaveManagerDevice,
}


declare const Scrypted: ScryptedStatic;

export default Scrypted;
