/// <reference path="./node.d.ts" />
/// <reference path="./Q.d.ts" />

declare module 'vso-node-api/Serialization' {
	/**
	* Metadata for deserializing an enum field on a contract/type
	*/
	export interface ContractEnumMetadata {
	    enumValues?: {
	        [name: string]: number;
	    };
	}
	export interface SerializationData {
	    requestTypeMetadata?: ContractMetadata;
	    responseTypeMetadata?: ContractMetadata;
	    responseIsCollection: boolean;
	}
	/**
	* Metadata for deserializing a particular field on a contract/type
	*/
	export interface ContractFieldMetadata {
	    isArray?: boolean;
	    isDate?: boolean;
	    enumType?: ContractEnumMetadata;
	    typeInfo?: ContractMetadata;
	    isDictionary?: boolean;
	    dictionaryKeyIsDate?: boolean;
	    dictionaryValueIsDate?: boolean;
	    dictionaryKeyEnumType?: ContractEnumMetadata;
	    dictionaryValueEnumType?: ContractEnumMetadata;
	    dictionaryValueTypeInfo?: ContractMetadata;
	    dictionaryValueFieldInfo?: ContractFieldMetadata;
	}
	/**
	* Metadata required for deserializing a given type
	*/
	export interface ContractMetadata {
	    fields?: {
	        [fieldName: string]: ContractFieldMetadata;
	    };
	}
	export interface IWebApiArrayResult {
	    count: number;
	    value: any[];
	}
	/**
	* Module for handling serialization and deserialization of data contracts
	* (contracts sent from the server using the VSO default REST api serialization settings)
	*/
	export module ContractSerializer {
	    /**
	     * Process a contract in its raw form (e.g. date fields are Dates, and Enums are numbers) and
	     * return a pure JSON object that can be posted to REST endpoint.
	     *
	     * @param data The object to serialize
	     * @param contractMetadata The type info/metadata for the contract type being serialized
	     * @param preserveOriginal If true, don't modify the original object. False modifies the original object (the return value points to the data argument).
	     */
	    function serialize(data: any, contractMetadata: ContractMetadata, preserveOriginal?: boolean): any;
	    /**
	     * Process a pure JSON object (e.g. that came from a REST call) and transform it into a JS object
	     * where date strings are converted to Date objects and enum values are converted from strings into
	     * their numerical value.
	     *
	     * @param data The object to deserialize
	     * @param contractMetadata The type info/metadata for the contract type being deserialize
	     * @param preserveOriginal If true, don't modify the original object. False modifies the original object (the return value points to the data argument).
	     * @param unwrapWrappedCollections If true check for wrapped arrays (REST apis will not return arrays directly as the root result but will instead wrap them in a { values: [], count: 0 } object.
	     */
	    function deserialize(data: any, contractMetadata: ContractMetadata, preserveOriginal?: boolean, unwrapWrappedCollections?: boolean): any;
	}

}
declare module 'vso-node-api/interfaces/common/VsoBaseInterfaces' {
	import Serialization = require('vso-node-api/Serialization');
	/**
	 * Information about the location of a REST API resource
	 */
	export interface ApiResourceLocation {
	    /**
	     * Area name for this resource
	     */
	    area: string;
	    /**
	     * Unique Identifier for this location
	     */
	    id: string;
	    /**
	     * Maximum api version that this resource supports (current server version for this resource)
	     */
	    maxVersion: string;
	    /**
	     * Minimum api version that this resource supports
	     */
	    minVersion: string;
	    /**
	     * The latest version of this resource location that is in "Release" (non-preview) mode
	     */
	    releasedVersion: string;
	    /**
	     * Resource name
	     */
	    resourceName: string;
	    /**
	     * The current resource version supported by this resource location
	     */
	    resourceVersion: number;
	    /**
	     * This location's route template (templated relative path)
	     */
	    routeTemplate: string;
	}
	export interface IHeaders {
	    [key: string]: any;
	}
	export interface IBasicCredentials {
	    username: string;
	    password: string;
	}
	export interface IRequestHandler {
	    prepareRequest(options: any): void;
	    canHandleAuthentication(res: IHttpResponse): boolean;
	    handleAuthentication(httpClient: any, protocol: any, options: any, objs: any, finalCallback: any): void;
	}
	export interface IHttpResponse {
	    statusCode?: number;
	    headers: any;
	}
	export interface IQCoreApi {
	    connect(): Q.Promise<void>;
	}
	export interface IHttpClient {
	    get(verb: string, requestUrl: string, headers: any, onResult: (err: any, res: IHttpResponse, contents: string) => void): void;
	    send(verb: string, requestUrl: string, objs: any, headers: any, onResult: (err: any, res: IHttpResponse, contents: string) => void): void;
	    sendFile(verb: string, requestUrl: string, content: NodeJS.ReadableStream, headers: any, onResult: (err: any, res: IHttpResponse, contents: string) => void): void;
	    getStream(requestUrl: string, apiVersion: string, headers: any, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    makeAcceptHeader(type: string, apiVersion: string): string;
	    request(protocol: any, options: any, body: any, onResult: (err: any, res: IHttpResponse, contents: string) => void): void;
	}
	export interface IRestClient {
	    baseUrl: string;
	    httpClient: IHttpClient;
	    getJson(relativeUrl: string, apiVersion: string, customHeaders: IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    options(requestUrl: string, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    create(relativeUrl: string, apiVersion: string, resources: any, customHeaders: IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    update(relativeUrl: string, apiVersion: string, resources: any, customHeaders: IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    uploadFile(verb: string, relativeUrl: string, apiVersion: string, filePath: string, customHeaders: IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    uploadStream(verb: string, relativeUrl: string, apiVersion: string, contentStream: NodeJS.ReadableStream, customHeaders: IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    replace(relativeUrl: string, apiVersion: string, resources: any, customHeaders: IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	}

}
declare module 'vso-node-api/HttpClient' {
	/// <reference path="../node/node.d.ts" />
	import http = require("http");
	import ifm = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	export class HttpClient implements ifm.IHttpClient {
	    userAgent: string;
	    handlers: ifm.IRequestHandler[];
	    socketTimeout: number;
	    isSsl: boolean;
	    constructor(userAgent: string, handlers?: ifm.IRequestHandler[], socketTimeout?: number);
	    get(verb: string, requestUrl: string, headers: ifm.IHeaders, onResult: (err: any, res: http.ClientResponse, contents: string) => void): void;
	    send(verb: string, requestUrl: string, objs: any, headers: ifm.IHeaders, onResult: (err: any, res: http.ClientResponse, contents: string) => void): void;
	    sendFile(verb: string, requestUrl: string, content: NodeJS.ReadableStream, headers: ifm.IHeaders, onResult: (err: any, res: http.ClientResponse, contents: string) => void): void;
	    getStream(requestUrl: string, apiVersion: string, type: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    makeAcceptHeader(type: string, apiVersion: string): string;
	    _getOptions(method: string, requestUrl: string, headers: any): any;
	    request(protocol: any, options: any, objs: any, onResult: (err: any, res: http.ClientResponse, contents: string) => void): void;
	    requestInternal(protocol: any, options: any, objs: any, onResult: (err: any, res: http.ClientResponse, contents: string) => void): void;
	}

}
declare module 'vso-node-api/RestClient' {
	/// <reference path="../node/node.d.ts" />
	import ifm = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	import Serialization = require('vso-node-api/Serialization');
	export function processResponse(url: any, res: any, contents: any, serializationData: Serialization.SerializationData, onResult: any): void;
	export function enumToString(enumType: any, enumValue: number, camelCase: boolean): any;
	export class RestClient implements ifm.IRestClient {
	    baseUrl: string;
	    basePath: string;
	    httpClient: ifm.IHttpClient;
	    constructor(httpClient: ifm.IHttpClient);
	    getJson(url: string, apiVersion: string, customHeaders: ifm.IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    options(url: string, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    delete(url: string, apiVersion: string, customHeaders: ifm.IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    create(url: string, apiVersion: string, resources: any, customHeaders: ifm.IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    update(url: string, apiVersion: string, resources: any, customHeaders: ifm.IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    uploadFile(verb: string, url: string, apiVersion: string, filePath: string, customHeaders: ifm.IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    uploadStream(verb: string, url: string, apiVersion: string, contentStream: NodeJS.ReadableStream, customHeaders: ifm.IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    replace(url: string, apiVersion: string, resources: any, customHeaders: ifm.IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    _getJson(verb: string, url: string, apiVersion: string, customHeaders: ifm.IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    _sendJson(verb: string, url: string, apiVersion: string, data: any, customHeaders: ifm.IHeaders, serializationData: Serialization.SerializationData, onResult: (err: any, statusCode: number, obj: any) => void): void;
	}

}
declare module 'vso-node-api/VsoClient' {
	/// <reference path="../q/Q.d.ts" />
	import Q = require("q");
	import restm = require('vso-node-api/RestClient');
	import ifm = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	export interface ClientVersioningData {
	    /**
	    * The api version string to send in the request (e.g. "1.0" or "2.0-preview.2")
	    */
	    apiVersion?: string;
	    /**
	    * The request path string to send the request to.  Looked up via an options request with the location id.
	    */
	    requestUrl?: string;
	}
	export class InvalidApiResourceVersionError implements Error {
	    name: string;
	    message: string;
	    constructor(message?: string);
	}
	/**
	* Base class that should be used (derived from) to make requests to VSS REST apis
	*/
	export class VsoClient {
	    private static APIS_RELATIVE_PATH;
	    private static PREVIEW_INDICATOR;
	    private _locationsByAreaPromises;
	    private _initializationPromise;
	    restClient: ifm.IRestClient;
	    baseUrl: string;
	    basePath: string;
	    constructor(baseUrl: string, restClient: restm.RestClient);
	    /**
	    * Compares the version on the server (locationVersion) to the api version given by the client (apiVersion).
	    * Returns a negative value if the location version is older (less than) the api version
	    * Returns 0 if the two are equal
	    * Returns a positive value if the location version is newer (greater than) the api version
	    */
	    private compareResourceVersions(locationVersion, apiVersion);
	    /**
	    * Gets the route template for a resource based on its location ID and negotiates the api version
	    */
	    getVersioningData(apiVersion: string, area: string, locationId: string, routeValues: any, queryParams?: any): Q.Promise<ClientVersioningData>;
	    /**
	     * Sets a promise that is waited on before any requests are issued. Can be used to asynchronously
	     * set the request url and auth token manager.
	     */
	    _setInitializationPromise(promise: Q.Promise<any>): void;
	    /**
	     * Gets information about an API resource location (route template, supported versions, etc.)
	     *
	     * @param area resource area name
	     * @param locationId Guid of the location to get
	     */
	    beginGetLocation(area: string, locationId: string): Q.Promise<ifm.ApiResourceLocation>;
	    private beginGetAreaLocations(area);
	    resolveUrl(relativeUrl: string): string;
	    /**
	    * Issues an OPTIONS request to get location objects from a location id
	    */
	    _issueOptionsRequest(requestUrl: string, onResult: (err: any, statusCode: number, locationsResult: any) => void): void;
	    private getSerializedObject(object);
	    protected getRequestUrl(routeTemplate: string, area: string, resource: string, routeValues: any, queryParams?: any): string;
	    private replaceRouteValues(routeTemplate, routeValues);
	    _getLinkResponseHeaders(xhr: XMLHttpRequest): {
	        [relName: string]: string;
	    };
	}

}
declare module 'vso-node-api/ClientApiBases' {
	import Q = require('q');
	import restm = require('vso-node-api/RestClient');
	import httpm = require('vso-node-api/HttpClient');
	import vsom = require('vso-node-api/VsoClient');
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	export class ClientApiBase {
	    baseUrl: string;
	    userAgent: string;
	    httpClient: httpm.HttpClient;
	    restClient: restm.RestClient;
	    vsoClient: vsom.VsoClient;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[], userAgent?: string);
	    setUserAgent(userAgent: string): void;
	    connect(onResult: (err: any, statusCode: number, obj: any) => void): void;
	}
	export class QClientApiBase {
	    api: ClientApiBase;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[], api: typeof ClientApiBase);
	    connect(): Q.Promise<any>;
	}

}
declare module 'vso-node-api/interfaces/common/VSSInterfaces' {
	export interface IdentityRef {
	    displayName: string;
	    id: string;
	    imageUrl: string;
	    isAadIdentity: boolean;
	    isContainer: boolean;
	    profileUrl: string;
	    uniqueName: string;
	    url: string;
	}
	export interface JsonPatchDocument {
	}
	/**
	 * The JSON model for a JSON Patch operation
	 */
	export interface JsonPatchOperation {
	    /**
	     * The path to copy from for the Move/Copy operation.
	     */
	    from: string;
	    /**
	     * The patch operation
	     */
	    op: Operation;
	    /**
	     * The path for the operation
	     */
	    path: string;
	    /**
	     * The value for the operation. This is either a primitive or a JToken.
	     */
	    value: any;
	}
	export enum Operation {
	    Add = 0,
	    Remove = 1,
	    Replace = 2,
	    Move = 3,
	    Copy = 4,
	    Test = 5,
	}
	export interface ResourceRef {
	    id: string;
	    url: string;
	}
	export interface VssJsonCollectionWrapper extends VssJsonCollectionWrapperBase {
	    value: any[];
	}
	export interface VssJsonCollectionWrapperV<T> extends VssJsonCollectionWrapperBase {
	    value: T;
	}
	export interface VssJsonCollectionWrapperBase {
	    count: number;
	}
	export var TypeInfo: {
	    IdentityRef: {
	        fields: any;
	    };
	    JsonPatchDocument: {
	        fields: any;
	    };
	    JsonPatchOperation: {
	        fields: any;
	    };
	    Operation: {
	        enumValues: {
	            "add": number;
	            "remove": number;
	            "replace": number;
	            "move": number;
	            "copy": number;
	            "test": number;
	        };
	    };
	    OperationReference: {
	        fields: any;
	    };
	    ResourceRef: {
	        fields: any;
	    };
	    VssJsonCollectionWrapper: {
	        fields: any;
	    };
	    VssJsonCollectionWrapperV: {
	        fields: any;
	    };
	    VssJsonCollectionWrapperBase: {
	        fields: any;
	    };
	};

}
declare module 'vso-node-api/interfaces/CoreInterfaces' {
	import VSSInterfaces = require('vso-node-api/interfaces/common/VSSInterfaces');
	export enum ConnectedServiceKind {
	    /**
	     * Custom or unknown service
	     */
	    Custom = 0,
	    /**
	     * Azure Subscription
	     */
	    AzureSubscription = 1,
	    /**
	     * Chef Connection
	     */
	    Chef = 2,
	    /**
	     * Generic Connection
	     */
	    Generic = 3,
	}
	export interface IdentityData {
	    identityIds: string[];
	}
	export interface Process extends ProcessReference {
	    _links: any;
	    description: string;
	    id: string;
	    isDefault: boolean;
	    type: ProcessType;
	}
	export interface ProcessReference {
	    name: string;
	    url: string;
	}
	export enum ProcessType {
	    System = 0,
	    Custom = 1,
	    Inherited = 2,
	}
	export enum ProjectChangeType {
	    Modified = 0,
	    Deleted = 1,
	    Added = 2,
	}
	/**
	 * Contains information of the project
	 */
	export interface ProjectInfo {
	    abbreviation: string;
	    description: string;
	    id: string;
	    lastUpdateTime: Date;
	    name: string;
	    properties: ProjectProperty[];
	    /**
	     * Current revision of the project
	     */
	    revision: number;
	    state: any;
	    uri: string;
	    version: number;
	}
	export interface ProjectMessage {
	    project: ProjectInfo;
	    projectChangeType: ProjectChangeType;
	}
	export interface ProjectProperty {
	    name: string;
	    value: string;
	}
	export interface Proxy {
	    /**
	     * This is a description string
	     */
	    description: string;
	    /**
	     * The friendly name of the server
	     */
	    friendlyName: string;
	    globalDefault: boolean;
	    /**
	     * This is a string representation of the site that the proxy server is located in (e.g. "NA-WA-RED")
	     */
	    site: string;
	    siteDefault: boolean;
	    /**
	     * The URL of the proxy server
	     */
	    url: string;
	}
	export enum SourceControlTypes {
	    Tfvc = 1,
	    Git = 2,
	}
	/**
	 * The Team Context for an operation.
	 */
	export interface TeamContext {
	    /**
	     * The team project Id or name.  Ignored if ProjectId is set.
	     */
	    project: string;
	    /**
	     * The Team Project ID.  Required if Project is not set.
	     */
	    projectId: string;
	    /**
	     * The Team Id or name.  Ignored if TeamId is set.
	     */
	    team: string;
	    /**
	     * The Team Id
	     */
	    teamId: string;
	}
	/**
	 * Represents a Team Project object.
	 */
	export interface TeamProject extends TeamProjectReference {
	    /**
	     * The links to other objects related to this object.
	     */
	    _links: any;
	    /**
	     * Set of capabilities this project has (such as process template & version control).
	     */
	    capabilities: {
	        [key: string]: {
	            [key: string]: string;
	        };
	    };
	    /**
	     * The shallow ref to the default team.
	     */
	    defaultTeam: WebApiTeamRef;
	}
	/**
	 * Data contract for a TeamProjectCollection.
	 */
	export interface TeamProjectCollection extends TeamProjectCollectionReference {
	    /**
	     * The links to other objects related to this object.
	     */
	    _links: any;
	    /**
	     * Project collection description.
	     */
	    description: string;
	    /**
	     * Project collection state.
	     */
	    state: string;
	}
	/**
	 * Reference object for a TeamProjectCollection.
	 */
	export interface TeamProjectCollectionReference {
	    /**
	     * Collection Id.
	     */
	    id: string;
	    /**
	     * Collection Name.
	     */
	    name: string;
	    /**
	     * Collection REST Url.
	     */
	    url: string;
	}
	/**
	 * Represents a shallow reference to a TeamProject.
	 */
	export interface TeamProjectReference {
	    /**
	     * Project abbreviation.
	     */
	    abbreviation: string;
	    /**
	     * The project's description (if any).
	     */
	    description: string;
	    /**
	     * Project identifier.
	     */
	    id: string;
	    /**
	     * Project name.
	     */
	    name: string;
	    /**
	     * Project revision.
	     */
	    revision: number;
	    /**
	     * Project state.
	     */
	    state: any;
	    /**
	     * Url to the full version of the object.
	     */
	    url: string;
	}
	export interface WebApiConnectedService extends WebApiConnectedServiceRef {
	    /**
	     * The user who did the OAuth authentication to created this service
	     */
	    authenticatedBy: VSSInterfaces.IdentityRef;
	    /**
	     * Extra description on the service.
	     */
	    description: string;
	    /**
	     * Friendly Name of service connection
	     */
	    friendlyName: string;
	    /**
	     * Id/Name of the connection service. For Ex: Subscription Id for Azure Connection
	     */
	    id: string;
	    /**
	     * The kind of service.
	     */
	    kind: string;
	    /**
	     * The project associated with this service
	     */
	    project: TeamProjectReference;
	    /**
	     * Optional uri to connect directly to the service such as https://windows.azure.com
	     */
	    serviceUri: string;
	}
	export interface WebApiConnectedServiceDetails extends WebApiConnectedServiceRef {
	    /**
	     * Meta data for service connection
	     */
	    connectedServiceMetaData: WebApiConnectedService;
	    /**
	     * Credential info
	     */
	    credentialsXml: string;
	    /**
	     * Optional uri to connect directly to the service such as https://windows.azure.com
	     */
	    endPoint: string;
	}
	export interface WebApiConnectedServiceRef {
	    id: string;
	    url: string;
	}
	/**
	 * The representation of data needed to create a tag definition which is sent across the wire.
	 */
	export interface WebApiCreateTagRequestData {
	    name: string;
	}
	export interface WebApiProject extends TeamProjectReference {
	    /**
	     * Set of capabilities this project has
	     */
	    capabilities: {
	        [key: string]: {
	            [key: string]: string;
	        };
	    };
	    /**
	     * Reference to collection which contains this project
	     */
	    collection: WebApiProjectCollectionRef;
	    /**
	     * Default team for this project
	     */
	    defaultTeam: WebApiTeamRef;
	}
	export interface WebApiProjectCollection extends WebApiProjectCollectionRef {
	    /**
	     * Project collection description
	     */
	    description: string;
	    /**
	     * Project collection state
	     */
	    state: string;
	}
	export interface WebApiProjectCollectionRef {
	    /**
	     * Collection Tfs Url (Host Url)
	     */
	    collectionUrl: string;
	    /**
	     * Collection Guid
	     */
	    id: string;
	    /**
	     * Collection Name
	     */
	    name: string;
	    /**
	     * Collection REST Url
	     */
	    url: string;
	}
	/**
	 * The representation of a tag definition which is sent across the wire.
	 */
	export interface WebApiTagDefinition {
	    active: boolean;
	    id: string;
	    name: string;
	    url: string;
	}
	export interface WebApiTeam extends WebApiTeamRef {
	    /**
	     * Team description
	     */
	    description: string;
	    /**
	     * Identity REST API Url to this team
	     */
	    identityUrl: string;
	}
	export interface WebApiTeamRef {
	    /**
	     * Team (Identity) Guid. A Team Foundation ID.
	     */
	    id: string;
	    /**
	     * Team name
	     */
	    name: string;
	    /**
	     * Team REST API Url
	     */
	    url: string;
	}
	export var TypeInfo: {
	    ConnectedServiceKind: {
	        enumValues: {
	            "custom": number;
	            "azureSubscription": number;
	            "chef": number;
	            "generic": number;
	        };
	    };
	    IdentityData: {
	        fields: any;
	    };
	    Process: {
	        fields: any;
	    };
	    ProcessReference: {
	        fields: any;
	    };
	    ProcessType: {
	        enumValues: {
	            "system": number;
	            "custom": number;
	            "inherited": number;
	        };
	    };
	    ProjectChangeType: {
	        enumValues: {
	            "modified": number;
	            "deleted": number;
	            "added": number;
	        };
	    };
	    ProjectInfo: {
	        fields: any;
	    };
	    ProjectMessage: {
	        fields: any;
	    };
	    ProjectProperty: {
	        fields: any;
	    };
	    Proxy: {
	        fields: any;
	    };
	    SourceControlTypes: {
	        enumValues: {
	            "tfvc": number;
	            "git": number;
	        };
	    };
	    TeamContext: {
	        fields: any;
	    };
	    TeamProject: {
	        fields: any;
	    };
	    TeamProjectCollection: {
	        fields: any;
	    };
	    TeamProjectCollectionReference: {
	        fields: any;
	    };
	    TeamProjectReference: {
	        fields: any;
	    };
	    WebApiConnectedService: {
	        fields: any;
	    };
	    WebApiConnectedServiceDetails: {
	        fields: any;
	    };
	    WebApiConnectedServiceRef: {
	        fields: any;
	    };
	    WebApiCreateTagRequestData: {
	        fields: any;
	    };
	    WebApiProject: {
	        fields: any;
	    };
	    WebApiProjectCollection: {
	        fields: any;
	    };
	    WebApiProjectCollectionRef: {
	        fields: any;
	    };
	    WebApiTagDefinition: {
	        fields: any;
	    };
	    WebApiTeam: {
	        fields: any;
	    };
	    WebApiTeamRef: {
	        fields: any;
	    };
	};

}
declare module 'vso-node-api/interfaces/BuildInterfaces' {
	import TfsCoreInterfaces = require('vso-node-api/interfaces/CoreInterfaces');
	import VSSInterfaces = require('vso-node-api/interfaces/common/VSSInterfaces');
	export interface AgentPoolQueue extends ShallowReference {
	    _links: any;
	    /**
	     * The pool used by this queue.
	     */
	    pool: TaskAgentPoolReference;
	}
	export enum AgentStatus {
	    /**
	     * Indicates that the build agent cannot be contacted.
	     */
	    Unavailable = 0,
	    /**
	     * Indicates that the build agent is currently available.
	     */
	    Available = 1,
	    /**
	     * Indicates that the build agent has taken itself offline.
	     */
	    Offline = 2,
	}
	export interface ArtifactResource {
	    _links: any;
	    /**
	     * The type-specific resource data. For example, "#/10002/5/drop", "$/drops/5", "\\myshare\myfolder\mydrops\5"
	     */
	    data: string;
	    /**
	     * Link to the resource. This might include things like query parameters to download as a zip file
	     */
	    downloadUrl: string;
	    /**
	     * Properties of Artifact Resource
	     */
	    properties: {
	        [key: string]: string;
	    };
	    /**
	     * The type of the resource: File container, version control folder, UNC path, etc.
	     */
	    type: string;
	    /**
	     * Link to the resource
	     */
	    url: string;
	}
	export enum AuditAction {
	    Add = 1,
	    Update = 2,
	    Delete = 3,
	}
	/**
	 * Data representation of a build
	 */
	export interface Build {
	    _links: any;
	    /**
	     * Build number/name of the build
	     */
	    buildNumber: string;
	    /**
	     * Build number revision
	     */
	    buildNumberRevision: number;
	    /**
	     * The build controller. This should only be set if the definition type is Xaml.
	     */
	    controller: BuildController;
	    /**
	     * The definition associated with the build
	     */
	    definition: DefinitionReference;
	    /**
	     * Indicates whether the build has been deleted.
	     */
	    deleted: boolean;
	    /**
	     * Demands
	     */
	    demands: any[];
	    /**
	     * Time that the build was completed
	     */
	    finishTime: Date;
	    /**
	     * Id of the build
	     */
	    id: number;
	    keepForever: boolean;
	    /**
	     * Process or person that last changed the build
	     */
	    lastChangedBy: VSSInterfaces.IdentityRef;
	    /**
	     * Date the build was last changed
	     */
	    lastChangedDate: Date;
	    /**
	     * Log location of the build
	     */
	    logs: BuildLogReference;
	    /**
	     * Orchestration plan for the build
	     */
	    orchestrationPlan: TaskOrchestrationPlanReference;
	    /**
	     * Parameters for the build
	     */
	    parameters: string;
	    /**
	     * The build's priority
	     */
	    priority: QueuePriority;
	    /**
	     * The team project
	     */
	    project: TfsCoreInterfaces.TeamProjectReference;
	    properties: any;
	    /**
	     * Quality of the xaml build (good, bad, etc.)
	     */
	    quality: string;
	    /**
	     * The queue. This should only be set if the definition type is Build.
	     */
	    queue: AgentPoolQueue;
	    /**
	     * Queue option of the build.
	     */
	    queueOptions: QueueOptions;
	    /**
	     * The current position of the build in the queue
	     */
	    queuePosition: number;
	    /**
	     * Time that the build was queued
	     */
	    queueTime: Date;
	    /**
	     * Reason that the build was created
	     */
	    reason: BuildReason;
	    /**
	     * The repository
	     */
	    repository: BuildRepository;
	    /**
	     * The identity that queued the build
	     */
	    requestedBy: VSSInterfaces.IdentityRef;
	    /**
	     * The identity on whose behalf the build was queued
	     */
	    requestedFor: VSSInterfaces.IdentityRef;
	    /**
	     * The build result
	     */
	    result: BuildResult;
	    /**
	     * Source branch
	     */
	    sourceBranch: string;
	    /**
	     * Source version
	     */
	    sourceVersion: string;
	    /**
	     * Time that the build was started
	     */
	    startTime: Date;
	    /**
	     * Status of the build
	     */
	    status: BuildStatus;
	    tags: string[];
	    /**
	     * Uri of the build
	     */
	    uri: string;
	    /**
	     * REST url of the build
	     */
	    url: string;
	    validationResults: BuildRequestValidationResult[];
	}
	export interface BuildAgent {
	    buildDirectory: string;
	    controller: ShallowReference;
	    createdDate: Date;
	    description: string;
	    enabled: boolean;
	    id: number;
	    messageQueueUrl: string;
	    name: string;
	    reservedForBuild: string;
	    server: ShallowReference;
	    status: AgentStatus;
	    statusMessage: string;
	    updatedDate: Date;
	    uri: string;
	    url: string;
	}
	export interface BuildArtifact {
	    /**
	     * The artifact id
	     */
	    id: number;
	    /**
	     * The name of the artifact
	     */
	    name: string;
	    /**
	     * The actual resource
	     */
	    resource: ArtifactResource;
	}
	export interface BuildArtifactAddedEvent extends BuildUpdatedEvent {
	    artifact: BuildArtifact;
	}
	export enum BuildAuthorizationScope {
	    /**
	     * The identity used should have build service account permissions scoped to the project collection. This is useful when resources for a single build are spread across multiple projects.
	     */
	    ProjectCollection = 1,
	    /**
	     * The identity used should have build service account permissions scoped to the project in which the build definition resides. This is useful for isolation of build jobs to a particular team project to avoid any unintentional escalation of privilege attacks during a build.
	     */
	    Project = 2,
	}
	/**
	 * Data representation of a build badge
	 */
	export interface BuildBadge {
	    /**
	     * Build id, if exists that this badge corresponds to
	     */
	    buildId: number;
	    /**
	     * Self Url that generates SVG
	     */
	    imageUrl: string;
	}
	export interface BuildChangesCalculatedEvent extends BuildUpdatedEvent {
	    changes: Change[];
	}
	export interface BuildCompletedEvent extends BuildUpdatedEvent {
	}
	export interface BuildController extends ShallowReference {
	    _links: any;
	    /**
	     * The date the controller was created.
	     */
	    createdDate: Date;
	    /**
	     * The description of the controller.
	     */
	    description: string;
	    /**
	     * Indicates whether the controller is enabled.
	     */
	    enabled: boolean;
	    /**
	     * The status of the controller.
	     */
	    status: ControllerStatus;
	    /**
	     * The date the controller was last updated.
	     */
	    updatedDate: Date;
	    /**
	     * The controller's URI.
	     */
	    uri: string;
	}
	export interface BuildDefinition extends BuildDefinitionReference {
	    _links: any;
	    /**
	     * Indicates whether badges are enabled for this definition
	     */
	    badgeEnabled: boolean;
	    build: BuildDefinitionStep[];
	    /**
	     * The build number format
	     */
	    buildNumberFormat: string;
	    /**
	     * The comment entered when saving the definition
	     */
	    comment: string;
	    demands: any[];
	    /**
	     * The description
	     */
	    description: string;
	    /**
	     * The drop location for the definition
	     */
	    dropLocation: string;
	    /**
	     * Gets or sets the job authorization scope for builds which are queued against this definition
	     */
	    jobAuthorizationScope: BuildAuthorizationScope;
	    /**
	     * Gets or sets the job execution timeout in minutes for builds which are queued against this definition
	     */
	    jobTimeoutInMinutes: number;
	    options: BuildOption[];
	    properties: any;
	    /**
	     * The repository
	     */
	    repository: BuildRepository;
	    retentionRules: RetentionPolicy[];
	    triggers: BuildTrigger[];
	    variables: {
	        [key: string]: BuildDefinitionVariable;
	    };
	}
	export interface BuildDefinitionChangedEvent {
	    changeType: AuditAction;
	    definition: BuildDefinition;
	}
	export interface BuildDefinitionChangingEvent {
	    changeType: AuditAction;
	    newDefinition: BuildDefinition;
	    originalDefinition: BuildDefinition;
	}
	export interface BuildDefinitionReference extends DefinitionReference {
	    /**
	     * The author of the definition.
	     */
	    authoredBy: VSSInterfaces.IdentityRef;
	    /**
	     * If this is a draft definition, it might have a parent
	     */
	    draftOf: DefinitionReference;
	    /**
	     * The quality of the definition document (draft, etc.)
	     */
	    quality: DefinitionQuality;
	    /**
	     * The default queue which should be used for requests.
	     */
	    queue: AgentPoolQueue;
	}
	export interface BuildDefinitionRevision {
	    changedBy: VSSInterfaces.IdentityRef;
	    changedDate: Date;
	    changeType: AuditAction;
	    comment: string;
	    definitionUrl: string;
	    name: string;
	    revision: number;
	}
	export interface BuildDefinitionSourceProvider {
	    /**
	     * Uri of the associated definition
	     */
	    definitionUri: string;
	    /**
	     * fields associated with this build definition
	     */
	    fields: {
	        [key: string]: string;
	    };
	    /**
	     * Id of this source provider
	     */
	    id: number;
	    /**
	     * The lst time this source provider was modified
	     */
	    lastModified: Date;
	    /**
	     * Name of the source provider
	     */
	    name: string;
	    /**
	     * Which trigger types are supported by this definition source provider
	     */
	    supportedTriggerTypes: DefinitionTriggerType;
	}
	export interface BuildDefinitionStep {
	    alwaysRun: boolean;
	    continueOnError: boolean;
	    displayName: string;
	    enabled: boolean;
	    inputs: {
	        [key: string]: string;
	    };
	    task: TaskDefinitionReference;
	}
	export interface BuildDefinitionTemplate {
	    canDelete: boolean;
	    category: string;
	    description: string;
	    iconTaskId: string;
	    id: string;
	    name: string;
	    template: BuildDefinition;
	}
	export interface BuildDefinitionVariable {
	    allowOverride: boolean;
	    isSecret: boolean;
	    value: string;
	}
	export interface BuildDeletedEvent extends RealtimeBuildEvent {
	    build: Build;
	}
	export interface BuildDeployment {
	    deployment: BuildSummary;
	    sourceBuild: ShallowReference;
	}
	export interface BuildDestroyedEvent extends RealtimeBuildEvent {
	    build: Build;
	}
	/**
	 * Represents a build log.
	 */
	export interface BuildLog extends BuildLogReference {
	    /**
	     * The date the log was created.
	     */
	    createdOn: Date;
	    /**
	     * The date the log was last changed.
	     */
	    lastChangedOn: Date;
	    /**
	     * The number of lines in the log.
	     */
	    lineCount: number;
	}
	/**
	 * Data representation of a build log reference
	 */
	export interface BuildLogReference {
	    /**
	     * The id of the log.
	     */
	    id: number;
	    /**
	     * The type of the log location.
	     */
	    type: string;
	    /**
	     * Full link to the log resource.
	     */
	    url: string;
	}
	export interface BuildOption {
	    definition: BuildOptionDefinitionReference;
	    enabled: boolean;
	    inputs: {
	        [key: string]: string;
	    };
	}
	export interface BuildOptionDefinition extends BuildOptionDefinitionReference {
	    description: string;
	    groups: BuildOptionGroupDefinition[];
	    inputs: BuildOptionInputDefinition[];
	    name: string;
	    ordinal: number;
	}
	export interface BuildOptionDefinitionReference {
	    id: string;
	}
	export interface BuildOptionGroupDefinition {
	    displayName: string;
	    isExpanded: boolean;
	    name: string;
	}
	export interface BuildOptionInputDefinition {
	    defaultValue: string;
	    groupName: string;
	    help: {
	        [key: string]: string;
	    };
	    label: string;
	    name: string;
	    options: {
	        [key: string]: string;
	    };
	    required: boolean;
	    type: BuildOptionInputType;
	    visibleRule: string;
	}
	export enum BuildOptionInputType {
	    String = 0,
	    Boolean = 1,
	    StringList = 2,
	    Radio = 3,
	    PickList = 4,
	    MultiLine = 5,
	}
	export enum BuildPhaseStatus {
	    /**
	     * The state is not known.
	     */
	    Unknown = 0,
	    /**
	     * The build phase completed unsuccessfully.
	     */
	    Failed = 1,
	    /**
	     * The build phase completed successfully.
	     */
	    Succeeded = 2,
	}
	export interface BuildPollingSummaryEvent {
	}
	export interface BuildProcessTemplate {
	    description: string;
	    fileExists: boolean;
	    id: number;
	    parameters: string;
	    serverPath: string;
	    supportedReasons: BuildReason;
	    teamProject: string;
	    templateType: ProcessTemplateType;
	    url: string;
	    version: string;
	}
	export enum BuildQueryOrder {
	    /**
	     * Order by finish time ascending.
	     */
	    FinishTimeAscending = 2,
	    /**
	     * Order by finish time descending.
	     */
	    FinishTimeDescending = 3,
	}
	export interface BuildQueuedEvent extends BuildUpdatedEvent {
	}
	export enum BuildReason {
	    /**
	     * No reason. This value should not be used.
	     */
	    None = 0,
	    /**
	     * The build was started manually.
	     */
	    Manual = 1,
	    /**
	     * The build was started for the trigger TriggerType.ContinuousIntegration.
	     */
	    IndividualCI = 2,
	    /**
	     * The build was started for the trigger TriggerType.BatchedContinuousIntegration.
	     */
	    BatchedCI = 4,
	    /**
	     * The build was started for the trigger TriggerType.Schedule.
	     */
	    Schedule = 8,
	    /**
	     * The build was created by a user.
	     */
	    UserCreated = 32,
	    /**
	     * The build was started manually for private validation.
	     */
	    ValidateShelveset = 64,
	    /**
	     * The build was started for the trigger ContinuousIntegrationType.Gated.
	     */
	    CheckInShelveset = 128,
	    /**
	     * The build was triggered for retention policy purposes.
	     */
	    Triggered = 175,
	    /**
	     * All reasons.
	     */
	    All = 239,
	}
	export interface BuildReference {
	    _links: any;
	    /**
	     * Build number/name of the build
	     */
	    buildNumber: string;
	    /**
	     * Time that the build was completed
	     */
	    finishTime: Date;
	    /**
	     * Id of the build
	     */
	    id: number;
	    /**
	     * Time that the build was queued
	     */
	    queueTime: Date;
	    /**
	     * The build result
	     */
	    result: BuildResult;
	    /**
	     * Time that the build was started
	     */
	    startTime: Date;
	    /**
	     * Status of the build
	     */
	    status: BuildStatus;
	}
	export interface BuildReportMetadata {
	    buildId: number;
	    content: string;
	    type: string;
	}
	export interface BuildRepository {
	    checkoutSubmodules: boolean;
	    /**
	     * Indicates whether to clean the target folder when getting code from the repository. This is a String so that it can reference variables.
	     */
	    clean: string;
	    /**
	     * Gets or sets the name of the default branch.
	     */
	    defaultBranch: string;
	    id: string;
	    /**
	     * Gets or sets the friendly name of the repository.
	     */
	    name: string;
	    properties: {
	        [key: string]: string;
	    };
	    /**
	     * Gets or sets the root folder.
	     */
	    rootFolder: string;
	    /**
	     * Gets or sets the type of the repository.
	     */
	    type: string;
	    /**
	     * Gets or sets the url of the repository.
	     */
	    url: string;
	}
	export interface BuildRequestValidationResult {
	    message: string;
	    result: ValidationResult;
	}
	export interface BuildResourceUsage {
	    distributedTaskAgents: number;
	    totalUsage: number;
	    xamlControllers: number;
	}
	export enum BuildResult {
	    /**
	     * No result
	     */
	    None = 0,
	    /**
	     * The build completed successfully.
	     */
	    Succeeded = 2,
	    /**
	     * The build completed compilation successfully but had other errors.
	     */
	    PartiallySucceeded = 4,
	    /**
	     * The build completed unsuccessfully.
	     */
	    Failed = 8,
	    /**
	     * The build was canceled before starting.
	     */
	    Canceled = 32,
	}
	export interface BuildServer {
	    agents: ShallowReference[];
	    controller: ShallowReference;
	    id: number;
	    isVirtual: boolean;
	    messageQueueUrl: string;
	    name: string;
	    requireClientCertificates: boolean;
	    status: ServiceHostStatus;
	    statusChangedDate: Date;
	    uri: string;
	    url: string;
	    version: number;
	}
	export interface BuildSettings {
	    daysToKeepDeletedBuildsBeforeDestroy: number;
	    defaultRetentionPolicy: RetentionPolicy;
	    maximumRetentionPolicy: RetentionPolicy;
	}
	export interface BuildStartedEvent extends BuildUpdatedEvent {
	}
	export enum BuildStatus {
	    /**
	     * No status.
	     */
	    None = 0,
	    /**
	     * The build is currently in progress.
	     */
	    InProgress = 1,
	    /**
	     * The build has completed.
	     */
	    Completed = 2,
	    /**
	     * The build is cancelling
	     */
	    Cancelling = 4,
	    /**
	     * The build is inactive in the queue.
	     */
	    Postponed = 8,
	    /**
	     * The build has not yet started.
	     */
	    NotStarted = 32,
	    /**
	     * All status.
	     */
	    All = 47,
	}
	export interface BuildSummary {
	    build: ShallowReference;
	    finishTime: Date;
	    keepForever: boolean;
	    quality: string;
	    reason: BuildReason;
	    requestedFor: VSSInterfaces.IdentityRef;
	    startTime: Date;
	    status: BuildStatus;
	}
	export interface BuildTrigger {
	    triggerType: DefinitionTriggerType;
	}
	export interface BuildUpdatedEvent extends RealtimeBuildEvent {
	    build: Build;
	}
	export interface BuildWorkspace {
	    mappings: MappingDetails[];
	}
	/**
	 * Represents a change associated with a build.
	 */
	export interface Change {
	    /**
	     * The author of the change.
	     */
	    author: VSSInterfaces.IdentityRef;
	    /**
	     * The location of a user-friendly representation of the resource.
	     */
	    displayUri: string;
	    /**
	     * Something that identifies the change. For a commit, this would be the SHA1. For a TFVC changeset, this would be the changeset id.
	     */
	    id: string;
	    /**
	     * The location of the full representation of the resource.
	     */
	    location: string;
	    /**
	     * A description of the change. This might be a commit message or changeset description.
	     */
	    message: string;
	    /**
	     * Indicates whether the message was truncated
	     */
	    messageTruncated: boolean;
	    /**
	     * A timestamp for the change.
	     */
	    timestamp: Date;
	    /**
	     * The type of change. "commit", "changeset", etc.
	     */
	    type: string;
	}
	export interface ConsoleLogEvent extends RealtimeBuildEvent {
	    lines: string[];
	    timelineId: string;
	    timelineRecordId: string;
	}
	export interface ContinuousDeploymentDefinition {
	    /**
	     * The connected service associated with the continuous deployment
	     */
	    connectedService: TfsCoreInterfaces.WebApiConnectedServiceRef;
	    /**
	     * The definition associated with the continuous deployment
	     */
	    definition: ShallowReference;
	    gitBranch: string;
	    hostedServiceName: string;
	    project: TfsCoreInterfaces.TeamProjectReference;
	    repositoryId: string;
	    storageAccountName: string;
	    subscriptionId: string;
	    website: string;
	    webspace: string;
	}
	export interface ContinuousIntegrationTrigger extends BuildTrigger {
	    batchChanges: boolean;
	    branchFilters: string[];
	    maxConcurrentBuildsPerBranch: number;
	    /**
	     * The polling interval in seconds.
	     */
	    pollingInterval: number;
	    /**
	     * This is the id of the polling job that polls the external repository.  Once the build definition is saved/updated, this value is set.
	     */
	    pollingJobId: string;
	}
	export enum ControllerStatus {
	    /**
	     * Indicates that the build controller cannot be contacted.
	     */
	    Unavailable = 0,
	    /**
	     * Indicates that the build controller is currently available.
	     */
	    Available = 1,
	    /**
	     * Indicates that the build controller has taken itself offline.
	     */
	    Offline = 2,
	}
	export enum DefinitionQuality {
	    Definition = 1,
	    Draft = 2,
	}
	export enum DefinitionQueryOrder {
	    /**
	     * No order
	     */
	    None = 0,
	    /**
	     * Order by created on/last modified time ascending.
	     */
	    LastModifiedAscending = 1,
	    /**
	     * Order by created on/last modified time descending.
	     */
	    LastModifiedDescending = 2,
	    /**
	     * Order by definition name ascending.
	     */
	    DefinitionNameAscending = 3,
	    /**
	     * Order by definition name descending.
	     */
	    DefinitionNameDescending = 4,
	}
	export enum DefinitionQueueStatus {
	    /**
	     * When enabled the definition queue allows builds to be queued by users, the system will queue scheduled, gated and continuous integration builds, and the queued builds will be started by the system.
	     */
	    Enabled = 0,
	    /**
	     * When paused the definition queue allows builds to be queued by users and the system will queue scheduled, gated and continuous integration builds. Builds in the queue will not be started by the system.
	     */
	    Paused = 1,
	    /**
	     * When disabled the definition queue will not allow builds to be queued by users and the system will not queue scheduled, gated or continuous integration builds. Builds already in the queue will not be started by the system.
	     */
	    Disabled = 2,
	}
	/**
	 * A reference to a definition.
	 */
	export interface DefinitionReference extends ShallowReference {
	    /**
	     * The date the definition was created
	     */
	    createdDate: Date;
	    /**
	     * The project.
	     */
	    project: TfsCoreInterfaces.TeamProjectReference;
	    /**
	     * If builds can be queued from this definition
	     */
	    queueStatus: DefinitionQueueStatus;
	    /**
	     * The definition revision number.
	     */
	    revision: number;
	    /**
	     * The type of the definition.
	     */
	    type: DefinitionType;
	    /**
	     * The Uri of the definition
	     */
	    uri: string;
	}
	export enum DefinitionTriggerType {
	    /**
	     * Manual builds only.
	     */
	    None = 1,
	    /**
	     * A build should be started for each changeset.
	     */
	    ContinuousIntegration = 2,
	    /**
	     * A build should be started for multiple changesets at a time at a specified interval.
	     */
	    BatchedContinuousIntegration = 4,
	    /**
	     * A build should be started on a specified schedule whether or not changesets exist.
	     */
	    Schedule = 8,
	    /**
	     * A validation build should be started for each check-in.
	     */
	    GatedCheckIn = 16,
	    /**
	     * A validation build should be started for each batch of check-ins.
	     */
	    BatchedGatedCheckIn = 32,
	    /**
	     * All types.
	     */
	    All = 63,
	}
	export enum DefinitionType {
	    Xaml = 1,
	    Build = 2,
	}
	export enum DeleteOptions {
	    /**
	     * No data should be deleted. This value should not be used.
	     */
	    None = 0,
	    /**
	     * The drop location should be deleted.
	     */
	    DropLocation = 1,
	    /**
	     * The test results should be deleted.
	     */
	    TestResults = 2,
	    /**
	     * The version control label should be deleted.
	     */
	    Label = 4,
	    /**
	     * The build should be deleted.
	     */
	    Details = 8,
	    /**
	     * Published symbols should be deleted.
	     */
	    Symbols = 16,
	    /**
	     * All data should be deleted.
	     */
	    All = 31,
	}
	/**
	 * Represents the data from the build information nodes for type "DeploymentInformation" for xaml builds
	 */
	export interface Deployment {
	    type: string;
	}
	/**
	 * Deployment iformation for type "Build"
	 */
	export interface DeploymentBuild extends Deployment {
	    buildId: number;
	}
	/**
	 * Deployment iformation for type "Deploy"
	 */
	export interface DeploymentDeploy extends Deployment {
	    message: string;
	}
	/**
	 * Deployment iformation for type "Test"
	 */
	export interface DeploymentTest extends Deployment {
	    runId: number;
	}
	export interface GatedCheckInTrigger extends BuildTrigger {
	    pathFilters: string[];
	    runContinuousIntegration: boolean;
	}
	export enum GetOption {
	    /**
	     * Use the latest changeset at the time the build is queued.
	     */
	    LatestOnQueue = 0,
	    /**
	     * Use the latest changeset at the time the build is started.
	     */
	    LatestOnBuild = 1,
	    /**
	     * A user-specified version has been supplied.
	     */
	    Custom = 2,
	}
	/**
	 * Data representation of an information node associated with a build
	 */
	export interface InformationNode {
	    /**
	     * Fields of the information node
	     */
	    fields: {
	        [key: string]: string;
	    };
	    /**
	     * Process or person that last modified this node
	     */
	    lastModifiedBy: string;
	    /**
	     * Date this node was last modified
	     */
	    lastModifiedDate: Date;
	    /**
	     * Node Id of this information node
	     */
	    nodeId: number;
	    /**
	     * Id of parent node (xml tree)
	     */
	    parentId: number;
	    /**
	     * The type of the information node
	     */
	    type: string;
	}
	export interface Issue {
	    category: string;
	    data: {
	        [key: string]: string;
	    };
	    message: string;
	    type: IssueType;
	}
	export enum IssueType {
	    Error = 1,
	    Warning = 2,
	}
	export interface MappingDetails {
	    localPath: string;
	    mappingType: string;
	    serverPath: string;
	}
	export enum ProcessTemplateType {
	    /**
	     * Indicates a custom template.
	     */
	    Custom = 0,
	    /**
	     * Indicates a default template.
	     */
	    Default = 1,
	    /**
	     * Indicates an upgrade template.
	     */
	    Upgrade = 2,
	}
	export interface PropertyValue {
	    /**
	     * Guid of identity that changed this property value
	     */
	    changedBy: string;
	    /**
	     * The date this property value was changed
	     */
	    changedDate: Date;
	    /**
	     * Name in the name value mapping
	     */
	    propertyName: string;
	    /**
	     * Value in the name value mapping
	     */
	    value: any;
	}
	export enum QueryDeletedOption {
	    /**
	     * Include only non-deleted builds.
	     */
	    ExcludeDeleted = 0,
	    /**
	     * Include deleted and non-deleted builds.
	     */
	    IncludeDeleted = 1,
	    /**
	     * Include only deleted builds.
	     */
	    OnlyDeleted = 2,
	}
	export enum QueueOptions {
	    /**
	     * No queue options
	     */
	    None = 0,
	    /**
	     * Create a plan Id for the build, do not run it
	     */
	    DoNotRun = 1,
	}
	export enum QueuePriority {
	    /**
	     * Low priority.
	     */
	    Low = 5,
	    /**
	     * Below normal priority.
	     */
	    BelowNormal = 4,
	    /**
	     * Normal priority.
	     */
	    Normal = 3,
	    /**
	     * Above normal priority.
	     */
	    AboveNormal = 2,
	    /**
	     * High priority.
	     */
	    High = 1,
	}
	export interface RealtimeBuildEvent {
	    buildId: number;
	}
	export interface RequestReference {
	    /**
	     * Id of the resource
	     */
	    id: number;
	    /**
	     * Name of the requestor
	     */
	    requestedFor: VSSInterfaces.IdentityRef;
	    /**
	     * Full http link to the resource
	     */
	    url: string;
	}
	export interface RetentionPolicy {
	    artifacts: string[];
	    branches: string[];
	    daysToKeep: number;
	    deleteBuildRecord: boolean;
	    deleteTestResults: boolean;
	    minimumToKeep: number;
	}
	export interface Schedule {
	    branchFilters: string[];
	    /**
	     * Days for a build (flags enum for days of the week)
	     */
	    daysToBuild: ScheduleDays;
	    /**
	     * The Job Id of the Scheduled job that will queue the scheduled build. Since a single trigger can have multiple schedules and we want a single job to process a single schedule (since each schedule has a list of branches to build), the schedule itself needs to define the Job Id. This value will be filled in when a definition is added or updated.  The UI does not provide it or use it.
	     */
	    scheduleJobId: string;
	    /**
	     * Local timezone hour to start
	     */
	    startHours: number;
	    /**
	     * Local timezone minute to start
	     */
	    startMinutes: number;
	    /**
	     * Time zone of the build schedule (string representation of the time zone id)
	     */
	    timeZoneId: string;
	}
	export enum ScheduleDays {
	    /**
	     * Do not run.
	     */
	    None = 0,
	    /**
	     * Run on Monday.
	     */
	    Monday = 1,
	    /**
	     * Run on Tuesday.
	     */
	    Tuesday = 2,
	    /**
	     * Run on Wednesday.
	     */
	    Wednesday = 4,
	    /**
	     * Run on Thursday.
	     */
	    Thursday = 8,
	    /**
	     * Run on Friday.
	     */
	    Friday = 16,
	    /**
	     * Run on Saturday.
	     */
	    Saturday = 32,
	    /**
	     * Run on Sunday.
	     */
	    Sunday = 64,
	    /**
	     * Run on all days of the week.
	     */
	    All = 127,
	}
	export interface ScheduleTrigger extends BuildTrigger {
	    schedules: Schedule[];
	}
	export enum ServiceHostStatus {
	    /**
	     * The service host is currently connected and accepting commands.
	     */
	    Online = 1,
	    /**
	     * The service host is currently disconnected and not accepting commands.
	     */
	    Offline = 2,
	}
	/**
	 * An abstracted reference to some other resource. This class is used to provide the build data contracts with a uniform way to reference other resources in a way that provides easy traversal through links.
	 */
	export interface ShallowReference {
	    /**
	     * Id of the resource
	     */
	    id: number;
	    /**
	     * Name of the linked resource (definition name, controller name, etc.)
	     */
	    name: string;
	    /**
	     * Full http link to the resource
	     */
	    url: string;
	}
	export interface SvnMappingDetails {
	    depth: number;
	    ignoreExternals: boolean;
	    localPath: string;
	    revision: string;
	    serverPath: string;
	}
	export interface SvnWorkspace {
	    mappings: SvnMappingDetails[];
	}
	export interface TaskAgentPoolReference {
	    id: number;
	    name: string;
	}
	export interface TaskDefinitionReference {
	    id: string;
	    versionSpec: string;
	}
	export interface TaskOrchestrationPlanReference {
	    planId: string;
	}
	export enum TaskResult {
	    Succeeded = 0,
	    SucceededWithIssues = 1,
	    Failed = 2,
	    Canceled = 3,
	    Skipped = 4,
	    Abandoned = 5,
	}
	export interface Timeline extends TimelineReference {
	    lastChangedBy: string;
	    lastChangedOn: Date;
	    records: TimelineRecord[];
	}
	export interface TimelineRecord {
	    _links: any;
	    changeId: number;
	    currentOperation: string;
	    details: TimelineReference;
	    errorCount: number;
	    finishTime: Date;
	    id: string;
	    issues: Issue[];
	    lastModified: Date;
	    log: BuildLogReference;
	    name: string;
	    order: number;
	    parentId: string;
	    percentComplete: number;
	    result: TaskResult;
	    resultCode: string;
	    startTime: Date;
	    state: TimelineRecordState;
	    type: string;
	    url: string;
	    warningCount: number;
	    workerName: string;
	}
	export enum TimelineRecordState {
	    Pending = 0,
	    InProgress = 1,
	    Completed = 2,
	}
	export interface TimelineRecordsUpdatedEvent extends RealtimeBuildEvent {
	    timelineRecords: TimelineRecord[];
	}
	export interface TimelineReference {
	    changeId: number;
	    id: string;
	    url: string;
	}
	export enum ValidationResult {
	    OK = 0,
	    Warning = 1,
	    Error = 2,
	}
	/**
	 * Mapping for a workspace
	 */
	export interface WorkspaceMapping {
	    /**
	     * Uri of the associated definition
	     */
	    definitionUri: string;
	    /**
	     * Depth of this mapping
	     */
	    depth: number;
	    /**
	     * local location of the definition
	     */
	    localItem: string;
	    /**
	     * type of workspace mapping
	     */
	    mappingType: WorkspaceMappingType;
	    /**
	     * Server location of the definition
	     */
	    serverItem: string;
	    /**
	     * Id of the workspace
	     */
	    workspaceId: number;
	}
	export enum WorkspaceMappingType {
	    /**
	     * The path is mapped in the workspace.
	     */
	    Map = 0,
	    /**
	     * The path is cloaked in the workspace.
	     */
	    Cloak = 1,
	}
	export interface WorkspaceTemplate {
	    /**
	     * Uri of the associated definition
	     */
	    definitionUri: string;
	    /**
	     * The identity that last modified this template
	     */
	    lastModifiedBy: string;
	    /**
	     * The last time this template was modified
	     */
	    lastModifiedDate: Date;
	    /**
	     * List of workspace mappings
	     */
	    mappings: WorkspaceMapping[];
	    /**
	     * Id of the workspace for this template
	     */
	    workspaceId: number;
	}
	export interface XamlBuildDefinition extends DefinitionReference {
	    _links: any;
	    /**
	     * Batch size of the definition
	     */
	    batchSize: number;
	    buildArgs: string;
	    /**
	     * The continuous integration quiet period
	     */
	    continuousIntegrationQuietPeriod: number;
	    /**
	     * The build controller
	     */
	    controller: BuildController;
	    /**
	     * The date this definition was created
	     */
	    createdOn: Date;
	    /**
	     * Default drop location for builds from this definition
	     */
	    defaultDropLocation: string;
	    /**
	     * Description of the definition
	     */
	    description: string;
	    /**
	     * The last build on this definition
	     */
	    lastBuild: ShallowReference;
	    /**
	     * The repository
	     */
	    repository: BuildRepository;
	    /**
	     * The reasons supported by the template
	     */
	    supportedReasons: BuildReason;
	    /**
	     * How builds are triggered from this definition
	     */
	    triggerType: DefinitionTriggerType;
	}
	export var TypeInfo: {
	    AgentPoolQueue: {
	        fields: any;
	    };
	    AgentStatus: {
	        enumValues: {
	            "unavailable": number;
	            "available": number;
	            "offline": number;
	        };
	    };
	    ArtifactResource: {
	        fields: any;
	    };
	    AuditAction: {
	        enumValues: {
	            "add": number;
	            "update": number;
	            "delete": number;
	        };
	    };
	    Build: {
	        fields: any;
	    };
	    BuildAgent: {
	        fields: any;
	    };
	    BuildArtifact: {
	        fields: any;
	    };
	    BuildArtifactAddedEvent: {
	        fields: any;
	    };
	    BuildAuthorizationScope: {
	        enumValues: {
	            "projectCollection": number;
	            "project": number;
	        };
	    };
	    BuildBadge: {
	        fields: any;
	    };
	    BuildChangesCalculatedEvent: {
	        fields: any;
	    };
	    BuildCompletedEvent: {
	        fields: any;
	    };
	    BuildController: {
	        fields: any;
	    };
	    BuildDefinition: {
	        fields: any;
	    };
	    BuildDefinitionChangedEvent: {
	        fields: any;
	    };
	    BuildDefinitionChangingEvent: {
	        fields: any;
	    };
	    BuildDefinitionReference: {
	        fields: any;
	    };
	    BuildDefinitionRevision: {
	        fields: any;
	    };
	    BuildDefinitionSourceProvider: {
	        fields: any;
	    };
	    BuildDefinitionStep: {
	        fields: any;
	    };
	    BuildDefinitionTemplate: {
	        fields: any;
	    };
	    BuildDefinitionVariable: {
	        fields: any;
	    };
	    BuildDeletedEvent: {
	        fields: any;
	    };
	    BuildDeployment: {
	        fields: any;
	    };
	    BuildDestroyedEvent: {
	        fields: any;
	    };
	    BuildLog: {
	        fields: any;
	    };
	    BuildLogReference: {
	        fields: any;
	    };
	    BuildOption: {
	        fields: any;
	    };
	    BuildOptionDefinition: {
	        fields: any;
	    };
	    BuildOptionDefinitionReference: {
	        fields: any;
	    };
	    BuildOptionGroupDefinition: {
	        fields: any;
	    };
	    BuildOptionInputDefinition: {
	        fields: any;
	    };
	    BuildOptionInputType: {
	        enumValues: {
	            "string": number;
	            "boolean": number;
	            "stringList": number;
	            "radio": number;
	            "pickList": number;
	            "multiLine": number;
	        };
	    };
	    BuildPhaseStatus: {
	        enumValues: {
	            "unknown": number;
	            "failed": number;
	            "succeeded": number;
	        };
	    };
	    BuildPollingSummaryEvent: {
	        fields: any;
	    };
	    BuildProcessTemplate: {
	        fields: any;
	    };
	    BuildQueryOrder: {
	        enumValues: {
	            "finishTimeAscending": number;
	            "finishTimeDescending": number;
	        };
	    };
	    BuildQueuedEvent: {
	        fields: any;
	    };
	    BuildReason: {
	        enumValues: {
	            "none": number;
	            "manual": number;
	            "individualCI": number;
	            "batchedCI": number;
	            "schedule": number;
	            "userCreated": number;
	            "validateShelveset": number;
	            "checkInShelveset": number;
	            "triggered": number;
	            "all": number;
	        };
	    };
	    BuildReference: {
	        fields: any;
	    };
	    BuildReportMetadata: {
	        fields: any;
	    };
	    BuildRepository: {
	        fields: any;
	    };
	    BuildRequestValidationResult: {
	        fields: any;
	    };
	    BuildResourceUsage: {
	        fields: any;
	    };
	    BuildResult: {
	        enumValues: {
	            "none": number;
	            "succeeded": number;
	            "partiallySucceeded": number;
	            "failed": number;
	            "canceled": number;
	        };
	    };
	    BuildServer: {
	        fields: any;
	    };
	    BuildSettings: {
	        fields: any;
	    };
	    BuildStartedEvent: {
	        fields: any;
	    };
	    BuildStatus: {
	        enumValues: {
	            "none": number;
	            "inProgress": number;
	            "completed": number;
	            "cancelling": number;
	            "postponed": number;
	            "notStarted": number;
	            "all": number;
	        };
	    };
	    BuildSummary: {
	        fields: any;
	    };
	    BuildTrigger: {
	        fields: any;
	    };
	    BuildUpdatedEvent: {
	        fields: any;
	    };
	    BuildWorkspace: {
	        fields: any;
	    };
	    Change: {
	        fields: any;
	    };
	    ConsoleLogEvent: {
	        fields: any;
	    };
	    ContinuousDeploymentDefinition: {
	        fields: any;
	    };
	    ContinuousIntegrationTrigger: {
	        fields: any;
	    };
	    ControllerStatus: {
	        enumValues: {
	            "unavailable": number;
	            "available": number;
	            "offline": number;
	        };
	    };
	    DefinitionQuality: {
	        enumValues: {
	            "definition": number;
	            "draft": number;
	        };
	    };
	    DefinitionQueryOrder: {
	        enumValues: {
	            "none": number;
	            "lastModifiedAscending": number;
	            "lastModifiedDescending": number;
	            "definitionNameAscending": number;
	            "definitionNameDescending": number;
	        };
	    };
	    DefinitionQueueStatus: {
	        enumValues: {
	            "enabled": number;
	            "paused": number;
	            "disabled": number;
	        };
	    };
	    DefinitionReference: {
	        fields: any;
	    };
	    DefinitionTriggerType: {
	        enumValues: {
	            "none": number;
	            "continuousIntegration": number;
	            "batchedContinuousIntegration": number;
	            "schedule": number;
	            "gatedCheckIn": number;
	            "batchedGatedCheckIn": number;
	            "all": number;
	        };
	    };
	    DefinitionType: {
	        enumValues: {
	            "xaml": number;
	            "build": number;
	        };
	    };
	    DeleteOptions: {
	        enumValues: {
	            "none": number;
	            "dropLocation": number;
	            "testResults": number;
	            "label": number;
	            "details": number;
	            "symbols": number;
	            "all": number;
	        };
	    };
	    Deployment: {
	        fields: any;
	    };
	    DeploymentBuild: {
	        fields: any;
	    };
	    DeploymentDeploy: {
	        fields: any;
	    };
	    DeploymentTest: {
	        fields: any;
	    };
	    GatedCheckInTrigger: {
	        fields: any;
	    };
	    GetOption: {
	        enumValues: {
	            "latestOnQueue": number;
	            "latestOnBuild": number;
	            "custom": number;
	        };
	    };
	    InformationNode: {
	        fields: any;
	    };
	    Issue: {
	        fields: any;
	    };
	    IssueType: {
	        enumValues: {
	            "error": number;
	            "warning": number;
	        };
	    };
	    MappingDetails: {
	        fields: any;
	    };
	    ProcessTemplateType: {
	        enumValues: {
	            "custom": number;
	            "default": number;
	            "upgrade": number;
	        };
	    };
	    PropertyValue: {
	        fields: any;
	    };
	    QueryDeletedOption: {
	        enumValues: {
	            "excludeDeleted": number;
	            "includeDeleted": number;
	            "onlyDeleted": number;
	        };
	    };
	    QueueOptions: {
	        enumValues: {
	            "none": number;
	            "doNotRun": number;
	        };
	    };
	    QueuePriority: {
	        enumValues: {
	            "low": number;
	            "belowNormal": number;
	            "normal": number;
	            "aboveNormal": number;
	            "high": number;
	        };
	    };
	    RealtimeBuildEvent: {
	        fields: any;
	    };
	    RequestReference: {
	        fields: any;
	    };
	    RetentionPolicy: {
	        fields: any;
	    };
	    Schedule: {
	        fields: any;
	    };
	    ScheduleDays: {
	        enumValues: {
	            "none": number;
	            "monday": number;
	            "tuesday": number;
	            "wednesday": number;
	            "thursday": number;
	            "friday": number;
	            "saturday": number;
	            "sunday": number;
	            "all": number;
	        };
	    };
	    ScheduleTrigger: {
	        fields: any;
	    };
	    ServiceHostStatus: {
	        enumValues: {
	            "online": number;
	            "offline": number;
	        };
	    };
	    ShallowReference: {
	        fields: any;
	    };
	    SvnMappingDetails: {
	        fields: any;
	    };
	    SvnWorkspace: {
	        fields: any;
	    };
	    TaskAgentPoolReference: {
	        fields: any;
	    };
	    TaskDefinitionReference: {
	        fields: any;
	    };
	    TaskOrchestrationPlanReference: {
	        fields: any;
	    };
	    TaskResult: {
	        enumValues: {
	            "succeeded": number;
	            "succeededWithIssues": number;
	            "failed": number;
	            "canceled": number;
	            "skipped": number;
	            "abandoned": number;
	        };
	    };
	    Timeline: {
	        fields: any;
	    };
	    TimelineRecord: {
	        fields: any;
	    };
	    TimelineRecordState: {
	        enumValues: {
	            "pending": number;
	            "inProgress": number;
	            "completed": number;
	        };
	    };
	    TimelineRecordsUpdatedEvent: {
	        fields: any;
	    };
	    TimelineReference: {
	        fields: any;
	    };
	    ValidationResult: {
	        enumValues: {
	            "oK": number;
	            "warning": number;
	            "error": number;
	        };
	    };
	    WorkspaceMapping: {
	        fields: any;
	    };
	    WorkspaceMappingType: {
	        enumValues: {
	            "map": number;
	            "cloak": number;
	        };
	    };
	    WorkspaceTemplate: {
	        fields: any;
	    };
	    XamlBuildDefinition: {
	        fields: any;
	    };
	};

}
declare module 'vso-node-api/BuildApi' {
	/// <reference path="../node/node.d.ts" />
	/// <reference path="../q/Q.d.ts" />
	import Q = require('q');
	import basem = require('vso-node-api/ClientApiBases');
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	import BuildInterfaces = require('vso-node-api/interfaces/BuildInterfaces');
	import VSSInterfaces = require('vso-node-api/interfaces/common/VSSInterfaces');
	export interface IBuildApi extends basem.ClientApiBase {
	    createArtifact(artifact: BuildInterfaces.BuildArtifact, buildId: number, project: string, onResult: (err: any, statusCode: number, artifact: BuildInterfaces.BuildArtifact) => void): void;
	    getArtifact(buildId: number, artifactName: string, project: string, onResult: (err: any, statusCode: number, artifact: BuildInterfaces.BuildArtifact) => void): void;
	    getArtifactContentZip(buildId: number, artifactName: string, project: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getArtifacts(buildId: number, project: string, onResult: (err: any, statusCode: number, artifacts: BuildInterfaces.BuildArtifact[]) => void): void;
	    getBadge(project: string, definitionId: number, branchName: string, onResult: (err: any, statusCode: number, badge: string) => void): void;
	    getBuildBadge(project: string, repoType: string, repoId: string, branchName: string, onResult: (err: any, statusCode: number, buildbadge: BuildInterfaces.BuildBadge) => void): void;
	    getBuildBadgeData(project: string, repoType: string, repoId: string, branchName: string, onResult: (err: any, statusCode: number, buildbadge: string) => void): void;
	    deleteBuild(buildId: number, project: string, onResult: (err: any, statusCode: number) => void): void;
	    getBuild(buildId: number, project: string, propertyFilters: string, onResult: (err: any, statusCode: number, build: BuildInterfaces.Build) => void): void;
	    getBuilds(project: string, definitions: number[], queues: number[], buildNumber: string, minFinishTime: Date, maxFinishTime: Date, requestedFor: string, reasonFilter: BuildInterfaces.BuildReason, statusFilter: BuildInterfaces.BuildStatus, resultFilter: BuildInterfaces.BuildResult, tagFilters: string[], properties: string[], type: BuildInterfaces.DefinitionType, top: number, continuationToken: string, maxBuildsPerDefinition: number, deletedFilter: BuildInterfaces.QueryDeletedOption, queryOrder: BuildInterfaces.BuildQueryOrder, branchName: string, onResult: (err: any, statusCode: number, builds: BuildInterfaces.Build[]) => void): void;
	    queueBuild(build: BuildInterfaces.Build, project: string, ignoreWarnings: boolean, checkInTicket: string, onResult: (err: any, statusCode: number, build: BuildInterfaces.Build) => void): void;
	    updateBuild(build: BuildInterfaces.Build, buildId: number, project: string, onResult: (err: any, statusCode: number, build: BuildInterfaces.Build) => void): void;
	    getBuildChanges(project: string, buildId: number, continuationToken: string, top: number, includeSourceChange: boolean, onResult: (err: any, statusCode: number, changes: BuildInterfaces.Change[]) => void): void;
	    getChangesBetweenBuilds(project: string, fromBuildId: number, toBuildId: number, top: number, onResult: (err: any, statusCode: number, changes: BuildInterfaces.Change[]) => void): void;
	    getBuildController(controllerId: number, onResult: (err: any, statusCode: number, Controller: BuildInterfaces.BuildController) => void): void;
	    getBuildControllers(name: string, onResult: (err: any, statusCode: number, Controllers: BuildInterfaces.BuildController[]) => void): void;
	    createDefinition(definition: BuildInterfaces.BuildDefinition, project: string, definitionToCloneId: number, definitionToCloneRevision: number, onResult: (err: any, statusCode: number, definition: BuildInterfaces.BuildDefinition) => void): void;
	    deleteDefinition(definitionId: number, project: string, onResult: (err: any, statusCode: number) => void): void;
	    getDefinition(definitionId: number, project: string, revision: number, propertyFilters: string[], onResult: (err: any, statusCode: number, definition: BuildInterfaces.DefinitionReference) => void): void;
	    getDefinitions(project: string, name: string, type: BuildInterfaces.DefinitionType, repositoryId: string, repositoryType: string, queryOrder: BuildInterfaces.DefinitionQueryOrder, top: number, continuationToken: string, onResult: (err: any, statusCode: number, definitions: BuildInterfaces.DefinitionReference[]) => void): void;
	    updateDefinition(definition: BuildInterfaces.BuildDefinition, definitionId: number, project: string, secretsSourceDefinitionId: number, secretsSourceDefinitionRevision: number, onResult: (err: any, statusCode: number, definition: BuildInterfaces.BuildDefinition) => void): void;
	    getBuildDeployments(project: string, buildId: number, onResult: (err: any, statusCode: number, deployments: BuildInterfaces.Deployment[]) => void): void;
	    getBuildLog(project: string, buildId: number, logId: number, startLine: number, endLine: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getBuildLogs(project: string, buildId: number, onResult: (err: any, statusCode: number, logs: BuildInterfaces.BuildLog[]) => void): void;
	    getBuildLogsZip(project: string, buildId: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getBuildOptionDefinitions(project: string, onResult: (err: any, statusCode: number, options: BuildInterfaces.BuildOptionDefinition[]) => void): void;
	    createQueue(queue: BuildInterfaces.AgentPoolQueue, onResult: (err: any, statusCode: number, queue: BuildInterfaces.AgentPoolQueue) => void): void;
	    deleteQueue(id: number, onResult: (err: any, statusCode: number) => void): void;
	    getAgentPoolQueue(controllerId: number, onResult: (err: any, statusCode: number, queue: BuildInterfaces.AgentPoolQueue) => void): void;
	    getQueues(name: string, onResult: (err: any, statusCode: number, queues: BuildInterfaces.AgentPoolQueue[]) => void): void;
	    getBuildReport(project: string, buildId: number, type: string, onResult: (err: any, statusCode: number, report: BuildInterfaces.BuildReportMetadata) => void): void;
	    getBuildReportHtmlContent(project: string, buildId: number, type: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getResourceUsage(onResult: (err: any, statusCode: number, ResourceUsage: BuildInterfaces.BuildResourceUsage) => void): void;
	    getDefinitionRevisions(project: string, definitionId: number, onResult: (err: any, statusCode: number, revisions: BuildInterfaces.BuildDefinitionRevision[]) => void): void;
	    getBuildSettings(onResult: (err: any, statusCode: number, setting: BuildInterfaces.BuildSettings) => void): void;
	    updateBuildSettings(settings: BuildInterfaces.BuildSettings, onResult: (err: any, statusCode: number, setting: BuildInterfaces.BuildSettings) => void): void;
	    addBuildTag(project: string, buildId: number, tag: string, onResult: (err: any, statusCode: number, tags: string[]) => void): void;
	    addBuildTags(tags: string[], project: string, buildId: number, onResult: (err: any, statusCode: number, tags: string[]) => void): void;
	    deleteBuildTag(project: string, buildId: number, tag: string, onResult: (err: any, statusCode: number, tags: string[]) => void): void;
	    getBuildTags(project: string, buildId: number, onResult: (err: any, statusCode: number, tags: string[]) => void): void;
	    getTags(project: string, onResult: (err: any, statusCode: number, tags: string[]) => void): void;
	    deleteTemplate(project: string, templateId: string, onResult: (err: any, statusCode: number) => void): void;
	    getTemplate(project: string, templateId: string, onResult: (err: any, statusCode: number, template: BuildInterfaces.BuildDefinitionTemplate) => void): void;
	    getTemplates(project: string, onResult: (err: any, statusCode: number, templates: BuildInterfaces.BuildDefinitionTemplate[]) => void): void;
	    saveTemplate(template: BuildInterfaces.BuildDefinitionTemplate, project: string, templateId: string, onResult: (err: any, statusCode: number, template: BuildInterfaces.BuildDefinitionTemplate) => void): void;
	    getBuildTimeline(project: string, buildId: number, timelineId: string, changeId: number, onResult: (err: any, statusCode: number, Timeline: BuildInterfaces.Timeline) => void): void;
	    getBuildWorkItemsRefs(project: string, buildId: number, top: number, onResult: (err: any, statusCode: number, workitems: VSSInterfaces.ResourceRef[]) => void): void;
	    getBuildWorkItemsRefsFromCommits(commitIds: string[], project: string, buildId: number, top: number, onResult: (err: any, statusCode: number, workitems: VSSInterfaces.ResourceRef[]) => void): void;
	    getWorkItemsBetweenBuilds(project: string, fromBuildId: number, toBuildId: number, top: number, onResult: (err: any, statusCode: number, workitems: VSSInterfaces.ResourceRef[]) => void): void;
	}
	export interface IQBuildApi extends basem.QClientApiBase {
	    createArtifact(artifact: BuildInterfaces.BuildArtifact, buildId: number, project?: string): Q.Promise<BuildInterfaces.BuildArtifact>;
	    getArtifact(buildId: number, artifactName: string, project?: string): Q.Promise<BuildInterfaces.BuildArtifact>;
	    getArtifactContentZip(buildId: number, artifactName: string, project?: string): Q.Promise<NodeJS.ReadableStream>;
	    getArtifacts(buildId: number, project?: string): Q.Promise<BuildInterfaces.BuildArtifact[]>;
	    getBadge(project: string, definitionId: number, branchName?: string): Q.Promise<string>;
	    getBuildBadge(project: string, repoType: string, repoId?: string, branchName?: string): Q.Promise<BuildInterfaces.BuildBadge>;
	    getBuildBadgeData(project: string, repoType: string, repoId?: string, branchName?: string): Q.Promise<string>;
	    deleteBuild(buildId: number, project?: string): Q.Promise<void>;
	    getBuild(buildId: number, project?: string, propertyFilters?: string): Q.Promise<BuildInterfaces.Build>;
	    getBuilds(project?: string, definitions?: number[], queues?: number[], buildNumber?: string, minFinishTime?: Date, maxFinishTime?: Date, requestedFor?: string, reasonFilter?: BuildInterfaces.BuildReason, statusFilter?: BuildInterfaces.BuildStatus, resultFilter?: BuildInterfaces.BuildResult, tagFilters?: string[], properties?: string[], type?: BuildInterfaces.DefinitionType, top?: number, continuationToken?: string, maxBuildsPerDefinition?: number, deletedFilter?: BuildInterfaces.QueryDeletedOption, queryOrder?: BuildInterfaces.BuildQueryOrder, branchName?: string): Q.Promise<BuildInterfaces.Build[]>;
	    queueBuild(build: BuildInterfaces.Build, project?: string, ignoreWarnings?: boolean, checkInTicket?: string): Q.Promise<BuildInterfaces.Build>;
	    updateBuild(build: BuildInterfaces.Build, buildId: number, project?: string): Q.Promise<BuildInterfaces.Build>;
	    getBuildChanges(project: string, buildId: number, continuationToken?: string, top?: number, includeSourceChange?: boolean): Q.Promise<BuildInterfaces.Change[]>;
	    getChangesBetweenBuilds(project: string, fromBuildId?: number, toBuildId?: number, top?: number): Q.Promise<BuildInterfaces.Change[]>;
	    getBuildController(controllerId: number): Q.Promise<BuildInterfaces.BuildController>;
	    getBuildControllers(name?: string): Q.Promise<BuildInterfaces.BuildController[]>;
	    createDefinition(definition: BuildInterfaces.BuildDefinition, project?: string, definitionToCloneId?: number, definitionToCloneRevision?: number): Q.Promise<BuildInterfaces.BuildDefinition>;
	    deleteDefinition(definitionId: number, project?: string): Q.Promise<void>;
	    getDefinition(definitionId: number, project?: string, revision?: number, propertyFilters?: string[]): Q.Promise<BuildInterfaces.DefinitionReference>;
	    getDefinitions(project?: string, name?: string, type?: BuildInterfaces.DefinitionType, repositoryId?: string, repositoryType?: string, queryOrder?: BuildInterfaces.DefinitionQueryOrder, top?: number, continuationToken?: string): Q.Promise<BuildInterfaces.DefinitionReference[]>;
	    updateDefinition(definition: BuildInterfaces.BuildDefinition, definitionId: number, project?: string, secretsSourceDefinitionId?: number, secretsSourceDefinitionRevision?: number): Q.Promise<BuildInterfaces.BuildDefinition>;
	    getBuildDeployments(project: string, buildId: number): Q.Promise<BuildInterfaces.Deployment[]>;
	    getBuildLog(project: string, buildId: number, logId: number, startLine?: number, endLine?: number): Q.Promise<NodeJS.ReadableStream>;
	    getBuildLogs(project: string, buildId: number): Q.Promise<BuildInterfaces.BuildLog[]>;
	    getBuildLogsZip(project: string, buildId: number): Q.Promise<NodeJS.ReadableStream>;
	    getBuildOptionDefinitions(project?: string): Q.Promise<BuildInterfaces.BuildOptionDefinition[]>;
	    createQueue(queue: BuildInterfaces.AgentPoolQueue): Q.Promise<BuildInterfaces.AgentPoolQueue>;
	    deleteQueue(id: number): Q.Promise<void>;
	    getAgentPoolQueue(controllerId: number): Q.Promise<BuildInterfaces.AgentPoolQueue>;
	    getQueues(name?: string): Q.Promise<BuildInterfaces.AgentPoolQueue[]>;
	    getBuildReport(project: string, buildId: number, type?: string): Q.Promise<BuildInterfaces.BuildReportMetadata>;
	    getBuildReportHtmlContent(project: string, buildId: number, type?: string): Q.Promise<NodeJS.ReadableStream>;
	    getResourceUsage(): Q.Promise<BuildInterfaces.BuildResourceUsage>;
	    getDefinitionRevisions(project: string, definitionId: number): Q.Promise<BuildInterfaces.BuildDefinitionRevision[]>;
	    getBuildSettings(): Q.Promise<BuildInterfaces.BuildSettings>;
	    updateBuildSettings(settings: BuildInterfaces.BuildSettings): Q.Promise<BuildInterfaces.BuildSettings>;
	    addBuildTag(project: string, buildId: number, tag: string): Q.Promise<string[]>;
	    addBuildTags(tags: string[], project: string, buildId: number): Q.Promise<string[]>;
	    deleteBuildTag(project: string, buildId: number, tag: string): Q.Promise<string[]>;
	    getBuildTags(project: string, buildId: number): Q.Promise<string[]>;
	    getTags(project: string): Q.Promise<string[]>;
	    deleteTemplate(project: string, templateId: string): Q.Promise<void>;
	    getTemplate(project: string, templateId: string): Q.Promise<BuildInterfaces.BuildDefinitionTemplate>;
	    getTemplates(project: string): Q.Promise<BuildInterfaces.BuildDefinitionTemplate[]>;
	    saveTemplate(template: BuildInterfaces.BuildDefinitionTemplate, project: string, templateId: string): Q.Promise<BuildInterfaces.BuildDefinitionTemplate>;
	    getBuildTimeline(project: string, buildId: number, timelineId?: string, changeId?: number): Q.Promise<BuildInterfaces.Timeline>;
	    getBuildWorkItemsRefs(project: string, buildId: number, top?: number): Q.Promise<VSSInterfaces.ResourceRef[]>;
	    getBuildWorkItemsRefsFromCommits(commitIds: string[], project: string, buildId: number, top?: number): Q.Promise<VSSInterfaces.ResourceRef[]>;
	    getWorkItemsBetweenBuilds(project: string, fromBuildId: number, toBuildId: number, top?: number): Q.Promise<VSSInterfaces.ResourceRef[]>;
	}
	export class BuildApi extends basem.ClientApiBase implements IBuildApi {
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	     * Associates an artifact with a build
	     *
	     * @param {BuildInterfaces.BuildArtifact} artifact
	     * @param {number} buildId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting BuildInterfaces.BuildArtifact
	     */
	    createArtifact(artifact: BuildInterfaces.BuildArtifact, buildId: number, project: string, onResult: (err: any, statusCode: number, artifact: BuildInterfaces.BuildArtifact) => void): void;
	    /**
	     * Gets a specific artifact for a build
	     *
	     * @param {number} buildId
	     * @param {string} artifactName
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting BuildInterfaces.BuildArtifact
	     */
	    getArtifact(buildId: number, artifactName: string, project: string, onResult: (err: any, statusCode: number, artifact: BuildInterfaces.BuildArtifact) => void): void;
	    /**
	     * Gets a specific artifact for a build
	     *
	     * @param {number} buildId
	     * @param {string} artifactName
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getArtifactContentZip(buildId: number, artifactName: string, project: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Gets all artifacts for a build
	     *
	     * @param {number} buildId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting BuildInterfaces.BuildArtifact[]
	     */
	    getArtifacts(buildId: number, project: string, onResult: (err: any, statusCode: number, artifacts: BuildInterfaces.BuildArtifact[]) => void): void;
	    /**
	     * @param {string} project
	     * @param {number} definitionId
	     * @param {string} branchName
	     * @param onResult callback function with the resulting string
	     */
	    getBadge(project: string, definitionId: number, branchName: string, onResult: (err: any, statusCode: number, badge: string) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {string} repoType
	     * @param {string} repoId
	     * @param {string} branchName
	     * @param onResult callback function with the resulting BuildInterfaces.BuildBadge
	     */
	    getBuildBadge(project: string, repoType: string, repoId: string, branchName: string, onResult: (err: any, statusCode: number, buildbadge: BuildInterfaces.BuildBadge) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {string} repoType
	     * @param {string} repoId
	     * @param {string} branchName
	     * @param onResult callback function with the resulting string
	     */
	    getBuildBadgeData(project: string, repoType: string, repoId: string, branchName: string, onResult: (err: any, statusCode: number, buildbadge: string) => void): void;
	    /**
	     * Deletes a build
	     *
	     * @param {number} buildId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function
	     */
	    deleteBuild(buildId: number, project: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * Gets a build
	     *
	     * @param {number} buildId
	     * @param {string} project - Project ID or project name
	     * @param {string} propertyFilters - A comma-delimited list of properties to include in the results
	     * @param onResult callback function with the resulting BuildInterfaces.Build
	     */
	    getBuild(buildId: number, project: string, propertyFilters: string, onResult: (err: any, statusCode: number, build: BuildInterfaces.Build) => void): void;
	    /**
	     * Gets builds
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number[]} definitions - A comma-delimited list of definition ids
	     * @param {number[]} queues - A comma-delimited list of queue ids
	     * @param {string} buildNumber
	     * @param {Date} minFinishTime
	     * @param {Date} maxFinishTime
	     * @param {string} requestedFor
	     * @param {BuildInterfaces.BuildReason} reasonFilter
	     * @param {BuildInterfaces.BuildStatus} statusFilter
	     * @param {BuildInterfaces.BuildResult} resultFilter
	     * @param {string[]} tagFilters - A comma-delimited list of tags
	     * @param {string[]} properties - A comma-delimited list of properties to include in the results
	     * @param {BuildInterfaces.DefinitionType} type - The definition type
	     * @param {number} top - The maximum number of builds to retrieve
	     * @param {string} continuationToken
	     * @param {number} maxBuildsPerDefinition
	     * @param {BuildInterfaces.QueryDeletedOption} deletedFilter
	     * @param {BuildInterfaces.BuildQueryOrder} queryOrder
	     * @param {string} branchName
	     * @param onResult callback function with the resulting BuildInterfaces.Build[]
	     */
	    getBuilds(project: string, definitions: number[], queues: number[], buildNumber: string, minFinishTime: Date, maxFinishTime: Date, requestedFor: string, reasonFilter: BuildInterfaces.BuildReason, statusFilter: BuildInterfaces.BuildStatus, resultFilter: BuildInterfaces.BuildResult, tagFilters: string[], properties: string[], type: BuildInterfaces.DefinitionType, top: number, continuationToken: string, maxBuildsPerDefinition: number, deletedFilter: BuildInterfaces.QueryDeletedOption, queryOrder: BuildInterfaces.BuildQueryOrder, branchName: string, onResult: (err: any, statusCode: number, builds: BuildInterfaces.Build[]) => void): void;
	    /**
	     * Queues a build
	     *
	     * @param {BuildInterfaces.Build} build
	     * @param {string} project - Project ID or project name
	     * @param {boolean} ignoreWarnings
	     * @param {string} checkInTicket
	     * @param onResult callback function with the resulting BuildInterfaces.Build
	     */
	    queueBuild(build: BuildInterfaces.Build, project: string, ignoreWarnings: boolean, checkInTicket: string, onResult: (err: any, statusCode: number, build: BuildInterfaces.Build) => void): void;
	    /**
	     * Updates a build
	     *
	     * @param {BuildInterfaces.Build} build
	     * @param {number} buildId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting BuildInterfaces.Build
	     */
	    updateBuild(build: BuildInterfaces.Build, buildId: number, project: string, onResult: (err: any, statusCode: number, build: BuildInterfaces.Build) => void): void;
	    /**
	     * Gets the changes associated with a build
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param {string} continuationToken
	     * @param {number} top - The maximum number of changes to return
	     * @param {boolean} includeSourceChange
	     * @param onResult callback function with the resulting BuildInterfaces.Change[]
	     */
	    getBuildChanges(project: string, buildId: number, continuationToken: string, top: number, includeSourceChange: boolean, onResult: (err: any, statusCode: number, changes: BuildInterfaces.Change[]) => void): void;
	    /**
	     * Gets the changes associated between given builds
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} fromBuildId
	     * @param {number} toBuildId
	     * @param {number} top - The maximum number of changes to return
	     * @param onResult callback function with the resulting BuildInterfaces.Change[]
	     */
	    getChangesBetweenBuilds(project: string, fromBuildId: number, toBuildId: number, top: number, onResult: (err: any, statusCode: number, changes: BuildInterfaces.Change[]) => void): void;
	    /**
	     * Gets a controller
	     *
	     * @param {number} controllerId
	     * @param onResult callback function with the resulting BuildInterfaces.BuildController
	     */
	    getBuildController(controllerId: number, onResult: (err: any, statusCode: number, Controller: BuildInterfaces.BuildController) => void): void;
	    /**
	     * Gets controller, optionally filtered by name
	     *
	     * @param {string} name
	     * @param onResult callback function with the resulting BuildInterfaces.BuildController[]
	     */
	    getBuildControllers(name: string, onResult: (err: any, statusCode: number, Controllers: BuildInterfaces.BuildController[]) => void): void;
	    /**
	     * Creates a new definition
	     *
	     * @param {BuildInterfaces.BuildDefinition} definition
	     * @param {string} project - Project ID or project name
	     * @param {number} definitionToCloneId
	     * @param {number} definitionToCloneRevision
	     * @param onResult callback function with the resulting BuildInterfaces.BuildDefinition
	     */
	    createDefinition(definition: BuildInterfaces.BuildDefinition, project: string, definitionToCloneId: number, definitionToCloneRevision: number, onResult: (err: any, statusCode: number, definition: BuildInterfaces.BuildDefinition) => void): void;
	    /**
	     * Deletes a definition and all associated builds
	     *
	     * @param {number} definitionId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function
	     */
	    deleteDefinition(definitionId: number, project: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * Gets a definition, optionally at a specific revision
	     *
	     * @param {number} definitionId
	     * @param {string} project - Project ID or project name
	     * @param {number} revision
	     * @param {string[]} propertyFilters
	     * @param onResult callback function with the resulting BuildInterfaces.DefinitionReference
	     */
	    getDefinition(definitionId: number, project: string, revision: number, propertyFilters: string[], onResult: (err: any, statusCode: number, definition: BuildInterfaces.DefinitionReference) => void): void;
	    /**
	     * Gets definitions, optionally filtered by name
	     *
	     * @param {string} project - Project ID or project name
	     * @param {string} name
	     * @param {BuildInterfaces.DefinitionType} type
	     * @param {string} repositoryId
	     * @param {string} repositoryType
	     * @param {BuildInterfaces.DefinitionQueryOrder} queryOrder
	     * @param {number} top
	     * @param {string} continuationToken
	     * @param onResult callback function with the resulting BuildInterfaces.DefinitionReference[]
	     */
	    getDefinitions(project: string, name: string, type: BuildInterfaces.DefinitionType, repositoryId: string, repositoryType: string, queryOrder: BuildInterfaces.DefinitionQueryOrder, top: number, continuationToken: string, onResult: (err: any, statusCode: number, definitions: BuildInterfaces.DefinitionReference[]) => void): void;
	    /**
	     * Updates an existing definition
	     *
	     * @param {BuildInterfaces.BuildDefinition} definition
	     * @param {number} definitionId
	     * @param {string} project - Project ID or project name
	     * @param {number} secretsSourceDefinitionId
	     * @param {number} secretsSourceDefinitionRevision
	     * @param onResult callback function with the resulting BuildInterfaces.BuildDefinition
	     */
	    updateDefinition(definition: BuildInterfaces.BuildDefinition, definitionId: number, project: string, secretsSourceDefinitionId: number, secretsSourceDefinitionRevision: number, onResult: (err: any, statusCode: number, definition: BuildInterfaces.BuildDefinition) => void): void;
	    /**
	     * Gets the deployment information associated with a build
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param onResult callback function with the resulting BuildInterfaces.Deployment[]
	     */
	    getBuildDeployments(project: string, buildId: number, onResult: (err: any, statusCode: number, deployments: BuildInterfaces.Deployment[]) => void): void;
	    /**
	     * Gets a log
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param {number} logId
	     * @param {number} startLine
	     * @param {number} endLine
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getBuildLog(project: string, buildId: number, logId: number, startLine: number, endLine: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Gets logs for a build
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param onResult callback function with the resulting BuildInterfaces.BuildLog[]
	     */
	    getBuildLogs(project: string, buildId: number, onResult: (err: any, statusCode: number, logs: BuildInterfaces.BuildLog[]) => void): void;
	    /**
	     * Gets logs for a build
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getBuildLogsZip(project: string, buildId: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting BuildInterfaces.BuildOptionDefinition[]
	     */
	    getBuildOptionDefinitions(project: string, onResult: (err: any, statusCode: number, options: BuildInterfaces.BuildOptionDefinition[]) => void): void;
	    /**
	     * Creates a build queue
	     *
	     * @param {BuildInterfaces.AgentPoolQueue} queue
	     * @param onResult callback function with the resulting BuildInterfaces.AgentPoolQueue
	     */
	    createQueue(queue: BuildInterfaces.AgentPoolQueue, onResult: (err: any, statusCode: number, queue: BuildInterfaces.AgentPoolQueue) => void): void;
	    /**
	     * Deletes a build queue
	     *
	     * @param {number} id
	     * @param onResult callback function
	     */
	    deleteQueue(id: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * Gets a queue
	     *
	     * @param {number} controllerId
	     * @param onResult callback function with the resulting BuildInterfaces.AgentPoolQueue
	     */
	    getAgentPoolQueue(controllerId: number, onResult: (err: any, statusCode: number, queue: BuildInterfaces.AgentPoolQueue) => void): void;
	    /**
	     * Gets queues, optionally filtered by name
	     *
	     * @param {string} name
	     * @param onResult callback function with the resulting BuildInterfaces.AgentPoolQueue[]
	     */
	    getQueues(name: string, onResult: (err: any, statusCode: number, queues: BuildInterfaces.AgentPoolQueue[]) => void): void;
	    /**
	     * Gets report for a build
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param {string} type
	     * @param onResult callback function with the resulting BuildInterfaces.BuildReportMetadata
	     */
	    getBuildReport(project: string, buildId: number, type: string, onResult: (err: any, statusCode: number, report: BuildInterfaces.BuildReportMetadata) => void): void;
	    /**
	     * Gets report for a build
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param {string} type
	     * @param onResult callback function with the resulting any
	     */
	    getBuildReportHtmlContent(project: string, buildId: number, type: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param onResult callback function with the resulting BuildInterfaces.BuildResourceUsage
	     */
	    getResourceUsage(onResult: (err: any, statusCode: number, ResourceUsage: BuildInterfaces.BuildResourceUsage) => void): void;
	    /**
	     * Gets revisions of a definition
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} definitionId
	     * @param onResult callback function with the resulting BuildInterfaces.BuildDefinitionRevision[]
	     */
	    getDefinitionRevisions(project: string, definitionId: number, onResult: (err: any, statusCode: number, revisions: BuildInterfaces.BuildDefinitionRevision[]) => void): void;
	    /**
	     * @param onResult callback function with the resulting BuildInterfaces.BuildSettings
	     */
	    getBuildSettings(onResult: (err: any, statusCode: number, setting: BuildInterfaces.BuildSettings) => void): void;
	    /**
	     * Updates the build settings
	     *
	     * @param {BuildInterfaces.BuildSettings} settings
	     * @param onResult callback function with the resulting BuildInterfaces.BuildSettings
	     */
	    updateBuildSettings(settings: BuildInterfaces.BuildSettings, onResult: (err: any, statusCode: number, setting: BuildInterfaces.BuildSettings) => void): void;
	    /**
	     * Adds a tag to a build
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param {string} tag
	     * @param onResult callback function with the resulting string[]
	     */
	    addBuildTag(project: string, buildId: number, tag: string, onResult: (err: any, statusCode: number, tags: string[]) => void): void;
	    /**
	     * Adds tag to a build
	     *
	     * @param {string[]} tags
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param onResult callback function with the resulting string[]
	     */
	    addBuildTags(tags: string[], project: string, buildId: number, onResult: (err: any, statusCode: number, tags: string[]) => void): void;
	    /**
	     * Deletes a tag from a build
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param {string} tag
	     * @param onResult callback function with the resulting string[]
	     */
	    deleteBuildTag(project: string, buildId: number, tag: string, onResult: (err: any, statusCode: number, tags: string[]) => void): void;
	    /**
	     * Gets the tags for a build
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param onResult callback function with the resulting string[]
	     */
	    getBuildTags(project: string, buildId: number, onResult: (err: any, statusCode: number, tags: string[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting string[]
	     */
	    getTags(project: string, onResult: (err: any, statusCode: number, tags: string[]) => void): void;
	    /**
	     * Deletes a definition template
	     *
	     * @param {string} project - Project ID or project name
	     * @param {string} templateId
	     * @param onResult callback function
	     */
	    deleteTemplate(project: string, templateId: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * Gets definition template filtered by id
	     *
	     * @param {string} project - Project ID or project name
	     * @param {string} templateId
	     * @param onResult callback function with the resulting BuildInterfaces.BuildDefinitionTemplate
	     */
	    getTemplate(project: string, templateId: string, onResult: (err: any, statusCode: number, template: BuildInterfaces.BuildDefinitionTemplate) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting BuildInterfaces.BuildDefinitionTemplate[]
	     */
	    getTemplates(project: string, onResult: (err: any, statusCode: number, templates: BuildInterfaces.BuildDefinitionTemplate[]) => void): void;
	    /**
	     * Saves a definition template
	     *
	     * @param {BuildInterfaces.BuildDefinitionTemplate} template
	     * @param {string} project - Project ID or project name
	     * @param {string} templateId
	     * @param onResult callback function with the resulting BuildInterfaces.BuildDefinitionTemplate
	     */
	    saveTemplate(template: BuildInterfaces.BuildDefinitionTemplate, project: string, templateId: string, onResult: (err: any, statusCode: number, template: BuildInterfaces.BuildDefinitionTemplate) => void): void;
	    /**
	     * Gets details for a build
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param {string} timelineId
	     * @param {number} changeId
	     * @param onResult callback function with the resulting BuildInterfaces.Timeline
	     */
	    getBuildTimeline(project: string, buildId: number, timelineId: string, changeId: number, onResult: (err: any, statusCode: number, Timeline: BuildInterfaces.Timeline) => void): void;
	    /**
	     * Gets the work item ids associated with a build
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param {number} top - The maximum number of workitems to return
	     * @param onResult callback function with the resulting VSSInterfaces.ResourceRef[]
	     */
	    getBuildWorkItemsRefs(project: string, buildId: number, top: number, onResult: (err: any, statusCode: number, workitems: VSSInterfaces.ResourceRef[]) => void): void;
	    /**
	     * Gets the work item ids associated with build commits
	     *
	     * @param {string[]} commitIds
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param {number} top - The maximum number of workitems to return, also number of commits to consider if commitids are not sent
	     * @param onResult callback function with the resulting VSSInterfaces.ResourceRef[]
	     */
	    getBuildWorkItemsRefsFromCommits(commitIds: string[], project: string, buildId: number, top: number, onResult: (err: any, statusCode: number, workitems: VSSInterfaces.ResourceRef[]) => void): void;
	    /**
	     * Gets all the work item ids inbetween fromBuildId to toBuildId
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} fromBuildId
	     * @param {number} toBuildId
	     * @param {number} top - The maximum number of workitems to return
	     * @param onResult callback function with the resulting VSSInterfaces.ResourceRef[]
	     */
	    getWorkItemsBetweenBuilds(project: string, fromBuildId: number, toBuildId: number, top: number, onResult: (err: any, statusCode: number, workitems: VSSInterfaces.ResourceRef[]) => void): void;
	}
	export class QBuildApi extends basem.QClientApiBase implements IQBuildApi {
	    api: BuildApi;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	    * Associates an artifact with a build
	    *
	    * @param {BuildInterfaces.BuildArtifact} artifact
	    * @param {number} buildId
	    * @param {string} project - Project ID or project name
	    */
	    createArtifact(artifact: BuildInterfaces.BuildArtifact, buildId: number, project?: string): Q.Promise<BuildInterfaces.BuildArtifact>;
	    /**
	    * Gets a specific artifact for a build
	    *
	    * @param {number} buildId
	    * @param {string} artifactName
	    * @param {string} project - Project ID or project name
	    */
	    getArtifact(buildId: number, artifactName: string, project?: string): Q.Promise<BuildInterfaces.BuildArtifact>;
	    /**
	    * Gets a specific artifact for a build
	    *
	    * @param {number} buildId
	    * @param {string} artifactName
	    * @param {string} project - Project ID or project name
	    */
	    getArtifactContentZip(buildId: number, artifactName: string, project?: string): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Gets all artifacts for a build
	    *
	    * @param {number} buildId
	    * @param {string} project - Project ID or project name
	    */
	    getArtifacts(buildId: number, project?: string): Q.Promise<BuildInterfaces.BuildArtifact[]>;
	    /**
	    * @param {string} project
	    * @param {number} definitionId
	    * @param {string} branchName
	    */
	    getBadge(project: string, definitionId: number, branchName?: string): Q.Promise<string>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {string} repoType
	    * @param {string} repoId
	    * @param {string} branchName
	    */
	    getBuildBadge(project: string, repoType: string, repoId?: string, branchName?: string): Q.Promise<BuildInterfaces.BuildBadge>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {string} repoType
	    * @param {string} repoId
	    * @param {string} branchName
	    */
	    getBuildBadgeData(project: string, repoType: string, repoId?: string, branchName?: string): Q.Promise<string>;
	    /**
	    * Deletes a build
	    *
	    * @param {number} buildId
	    * @param {string} project - Project ID or project name
	    */
	    deleteBuild(buildId: number, project?: string): Q.Promise<void>;
	    /**
	    * Gets a build
	    *
	    * @param {number} buildId
	    * @param {string} project - Project ID or project name
	    * @param {string} propertyFilters - A comma-delimited list of properties to include in the results
	    */
	    getBuild(buildId: number, project?: string, propertyFilters?: string): Q.Promise<BuildInterfaces.Build>;
	    /**
	    * Gets builds
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number[]} definitions - A comma-delimited list of definition ids
	    * @param {number[]} queues - A comma-delimited list of queue ids
	    * @param {string} buildNumber
	    * @param {Date} minFinishTime
	    * @param {Date} maxFinishTime
	    * @param {string} requestedFor
	    * @param {BuildInterfaces.BuildReason} reasonFilter
	    * @param {BuildInterfaces.BuildStatus} statusFilter
	    * @param {BuildInterfaces.BuildResult} resultFilter
	    * @param {string[]} tagFilters - A comma-delimited list of tags
	    * @param {string[]} properties - A comma-delimited list of properties to include in the results
	    * @param {BuildInterfaces.DefinitionType} type - The definition type
	    * @param {number} top - The maximum number of builds to retrieve
	    * @param {string} continuationToken
	    * @param {number} maxBuildsPerDefinition
	    * @param {BuildInterfaces.QueryDeletedOption} deletedFilter
	    * @param {BuildInterfaces.BuildQueryOrder} queryOrder
	    * @param {string} branchName
	    */
	    getBuilds(project?: string, definitions?: number[], queues?: number[], buildNumber?: string, minFinishTime?: Date, maxFinishTime?: Date, requestedFor?: string, reasonFilter?: BuildInterfaces.BuildReason, statusFilter?: BuildInterfaces.BuildStatus, resultFilter?: BuildInterfaces.BuildResult, tagFilters?: string[], properties?: string[], type?: BuildInterfaces.DefinitionType, top?: number, continuationToken?: string, maxBuildsPerDefinition?: number, deletedFilter?: BuildInterfaces.QueryDeletedOption, queryOrder?: BuildInterfaces.BuildQueryOrder, branchName?: string): Q.Promise<BuildInterfaces.Build[]>;
	    /**
	    * Queues a build
	    *
	    * @param {BuildInterfaces.Build} build
	    * @param {string} project - Project ID or project name
	    * @param {boolean} ignoreWarnings
	    * @param {string} checkInTicket
	    */
	    queueBuild(build: BuildInterfaces.Build, project?: string, ignoreWarnings?: boolean, checkInTicket?: string): Q.Promise<BuildInterfaces.Build>;
	    /**
	    * Updates a build
	    *
	    * @param {BuildInterfaces.Build} build
	    * @param {number} buildId
	    * @param {string} project - Project ID or project name
	    */
	    updateBuild(build: BuildInterfaces.Build, buildId: number, project?: string): Q.Promise<BuildInterfaces.Build>;
	    /**
	    * Gets the changes associated with a build
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    * @param {string} continuationToken
	    * @param {number} top - The maximum number of changes to return
	    * @param {boolean} includeSourceChange
	    */
	    getBuildChanges(project: string, buildId: number, continuationToken?: string, top?: number, includeSourceChange?: boolean): Q.Promise<BuildInterfaces.Change[]>;
	    /**
	    * Gets the changes associated between given builds
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} fromBuildId
	    * @param {number} toBuildId
	    * @param {number} top - The maximum number of changes to return
	    */
	    getChangesBetweenBuilds(project: string, fromBuildId?: number, toBuildId?: number, top?: number): Q.Promise<BuildInterfaces.Change[]>;
	    /**
	    * Gets a controller
	    *
	    * @param {number} controllerId
	    */
	    getBuildController(controllerId: number): Q.Promise<BuildInterfaces.BuildController>;
	    /**
	    * Gets controller, optionally filtered by name
	    *
	    * @param {string} name
	    */
	    getBuildControllers(name?: string): Q.Promise<BuildInterfaces.BuildController[]>;
	    /**
	    * Creates a new definition
	    *
	    * @param {BuildInterfaces.BuildDefinition} definition
	    * @param {string} project - Project ID or project name
	    * @param {number} definitionToCloneId
	    * @param {number} definitionToCloneRevision
	    */
	    createDefinition(definition: BuildInterfaces.BuildDefinition, project?: string, definitionToCloneId?: number, definitionToCloneRevision?: number): Q.Promise<BuildInterfaces.BuildDefinition>;
	    /**
	    * Deletes a definition and all associated builds
	    *
	    * @param {number} definitionId
	    * @param {string} project - Project ID or project name
	    */
	    deleteDefinition(definitionId: number, project?: string): Q.Promise<void>;
	    /**
	    * Gets a definition, optionally at a specific revision
	    *
	    * @param {number} definitionId
	    * @param {string} project - Project ID or project name
	    * @param {number} revision
	    * @param {string[]} propertyFilters
	    */
	    getDefinition(definitionId: number, project?: string, revision?: number, propertyFilters?: string[]): Q.Promise<BuildInterfaces.DefinitionReference>;
	    /**
	    * Gets definitions, optionally filtered by name
	    *
	    * @param {string} project - Project ID or project name
	    * @param {string} name
	    * @param {BuildInterfaces.DefinitionType} type
	    * @param {string} repositoryId
	    * @param {string} repositoryType
	    * @param {BuildInterfaces.DefinitionQueryOrder} queryOrder
	    * @param {number} top
	    * @param {string} continuationToken
	    */
	    getDefinitions(project?: string, name?: string, type?: BuildInterfaces.DefinitionType, repositoryId?: string, repositoryType?: string, queryOrder?: BuildInterfaces.DefinitionQueryOrder, top?: number, continuationToken?: string): Q.Promise<BuildInterfaces.DefinitionReference[]>;
	    /**
	    * Updates an existing definition
	    *
	    * @param {BuildInterfaces.BuildDefinition} definition
	    * @param {number} definitionId
	    * @param {string} project - Project ID or project name
	    * @param {number} secretsSourceDefinitionId
	    * @param {number} secretsSourceDefinitionRevision
	    */
	    updateDefinition(definition: BuildInterfaces.BuildDefinition, definitionId: number, project?: string, secretsSourceDefinitionId?: number, secretsSourceDefinitionRevision?: number): Q.Promise<BuildInterfaces.BuildDefinition>;
	    /**
	    * Gets the deployment information associated with a build
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    */
	    getBuildDeployments(project: string, buildId: number): Q.Promise<BuildInterfaces.Deployment[]>;
	    /**
	    * Gets a log
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    * @param {number} logId
	    * @param {number} startLine
	    * @param {number} endLine
	    */
	    getBuildLog(project: string, buildId: number, logId: number, startLine?: number, endLine?: number): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Gets logs for a build
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    */
	    getBuildLogs(project: string, buildId: number): Q.Promise<BuildInterfaces.BuildLog[]>;
	    /**
	    * Gets logs for a build
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    */
	    getBuildLogsZip(project: string, buildId: number): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {string} project - Project ID or project name
	    */
	    getBuildOptionDefinitions(project?: string): Q.Promise<BuildInterfaces.BuildOptionDefinition[]>;
	    /**
	    * Creates a build queue
	    *
	    * @param {BuildInterfaces.AgentPoolQueue} queue
	    */
	    createQueue(queue: BuildInterfaces.AgentPoolQueue): Q.Promise<BuildInterfaces.AgentPoolQueue>;
	    /**
	    * Deletes a build queue
	    *
	    * @param {number} id
	    */
	    deleteQueue(id: number): Q.Promise<void>;
	    /**
	    * Gets a queue
	    *
	    * @param {number} controllerId
	    */
	    getAgentPoolQueue(controllerId: number): Q.Promise<BuildInterfaces.AgentPoolQueue>;
	    /**
	    * Gets queues, optionally filtered by name
	    *
	    * @param {string} name
	    */
	    getQueues(name?: string): Q.Promise<BuildInterfaces.AgentPoolQueue[]>;
	    /**
	    * Gets report for a build
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    * @param {string} type
	    */
	    getBuildReport(project: string, buildId: number, type?: string): Q.Promise<BuildInterfaces.BuildReportMetadata>;
	    /**
	    * Gets report for a build
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    * @param {string} type
	    */
	    getBuildReportHtmlContent(project: string, buildId: number, type?: string): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    */
	    getResourceUsage(): Q.Promise<BuildInterfaces.BuildResourceUsage>;
	    /**
	    * Gets revisions of a definition
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} definitionId
	    */
	    getDefinitionRevisions(project: string, definitionId: number): Q.Promise<BuildInterfaces.BuildDefinitionRevision[]>;
	    /**
	    */
	    getBuildSettings(): Q.Promise<BuildInterfaces.BuildSettings>;
	    /**
	    * Updates the build settings
	    *
	    * @param {BuildInterfaces.BuildSettings} settings
	    */
	    updateBuildSettings(settings: BuildInterfaces.BuildSettings): Q.Promise<BuildInterfaces.BuildSettings>;
	    /**
	    * Adds a tag to a build
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    * @param {string} tag
	    */
	    addBuildTag(project: string, buildId: number, tag: string): Q.Promise<string[]>;
	    /**
	    * Adds tag to a build
	    *
	    * @param {string[]} tags
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    */
	    addBuildTags(tags: string[], project: string, buildId: number): Q.Promise<string[]>;
	    /**
	    * Deletes a tag from a build
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    * @param {string} tag
	    */
	    deleteBuildTag(project: string, buildId: number, tag: string): Q.Promise<string[]>;
	    /**
	    * Gets the tags for a build
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    */
	    getBuildTags(project: string, buildId: number): Q.Promise<string[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    */
	    getTags(project: string): Q.Promise<string[]>;
	    /**
	    * Deletes a definition template
	    *
	    * @param {string} project - Project ID or project name
	    * @param {string} templateId
	    */
	    deleteTemplate(project: string, templateId: string): Q.Promise<void>;
	    /**
	    * Gets definition template filtered by id
	    *
	    * @param {string} project - Project ID or project name
	    * @param {string} templateId
	    */
	    getTemplate(project: string, templateId: string): Q.Promise<BuildInterfaces.BuildDefinitionTemplate>;
	    /**
	    * @param {string} project - Project ID or project name
	    */
	    getTemplates(project: string): Q.Promise<BuildInterfaces.BuildDefinitionTemplate[]>;
	    /**
	    * Saves a definition template
	    *
	    * @param {BuildInterfaces.BuildDefinitionTemplate} template
	    * @param {string} project - Project ID or project name
	    * @param {string} templateId
	    */
	    saveTemplate(template: BuildInterfaces.BuildDefinitionTemplate, project: string, templateId: string): Q.Promise<BuildInterfaces.BuildDefinitionTemplate>;
	    /**
	    * Gets details for a build
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    * @param {string} timelineId
	    * @param {number} changeId
	    */
	    getBuildTimeline(project: string, buildId: number, timelineId?: string, changeId?: number): Q.Promise<BuildInterfaces.Timeline>;
	    /**
	    * Gets the work item ids associated with a build
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    * @param {number} top - The maximum number of workitems to return
	    */
	    getBuildWorkItemsRefs(project: string, buildId: number, top?: number): Q.Promise<VSSInterfaces.ResourceRef[]>;
	    /**
	    * Gets the work item ids associated with build commits
	    *
	    * @param {string[]} commitIds
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    * @param {number} top - The maximum number of workitems to return, also number of commits to consider if commitids are not sent
	    */
	    getBuildWorkItemsRefsFromCommits(commitIds: string[], project: string, buildId: number, top?: number): Q.Promise<VSSInterfaces.ResourceRef[]>;
	    /**
	    * Gets all the work item ids inbetween fromBuildId to toBuildId
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} fromBuildId
	    * @param {number} toBuildId
	    * @param {number} top - The maximum number of workitems to return
	    */
	    getWorkItemsBetweenBuilds(project: string, fromBuildId: number, toBuildId: number, top?: number): Q.Promise<VSSInterfaces.ResourceRef[]>;
	}

}
declare module 'vso-node-api/interfaces/common/OperationsInterfaces' {
	/**
	 * Reference for an async operation.
	 */
	export interface OperationReference {
	    /**
	     * The identifier for this operation.
	     */
	    id: string;
	    /**
	     * The current status of the operation.
	     */
	    status: OperationStatus;
	    /**
	     * Url to get the full object.
	     */
	    url: string;
	}
	export enum OperationStatus {
	    /**
	     * The operation object does not have the status set.
	     */
	    NotSet = 0,
	    /**
	     * The operation has been queued.
	     */
	    Queued = 1,
	    /**
	     * The operation is in progress.
	     */
	    InProgress = 2,
	    /**
	     * The operation was cancelled by the user.
	     */
	    Cancelled = 3,
	    /**
	     * The operation completed successfully.
	     */
	    Succeeded = 4,
	    /**
	     * The operation completed with a failure.
	     */
	    Failed = 5,
	}
	export var TypeInfo: {
	    OperationReference: {
	        fields: any;
	    };
	    OperationStatus: {
	        enumValues: {
	            "notSet": number;
	            "queued": number;
	            "inProgress": number;
	            "cancelled": number;
	            "succeeded": number;
	            "failed": number;
	        };
	    };
	};

}
declare module 'vso-node-api/CoreApi' {
	/// <reference path="../node/node.d.ts" />
	/// <reference path="../q/Q.d.ts" />
	import Q = require('q');
	import basem = require('vso-node-api/ClientApiBases');
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	import CoreInterfaces = require('vso-node-api/interfaces/CoreInterfaces');
	import OperationsInterfaces = require('vso-node-api/interfaces/common/OperationsInterfaces');
	import VSSInterfaces = require('vso-node-api/interfaces/common/VSSInterfaces');
	export interface ICoreApi extends basem.ClientApiBase {
	    createConnectedService(connectedServiceCreationData: CoreInterfaces.WebApiConnectedServiceDetails, projectId: string, onResult: (err: any, statusCode: number, connectedService: CoreInterfaces.WebApiConnectedService) => void): void;
	    getConnectedServiceDetails(projectId: string, name: string, onResult: (err: any, statusCode: number, connectedService: CoreInterfaces.WebApiConnectedServiceDetails) => void): void;
	    getConnectedServices(projectId: string, kind: CoreInterfaces.ConnectedServiceKind, onResult: (err: any, statusCode: number, connectedServices: CoreInterfaces.WebApiConnectedService[]) => void): void;
	    createIdentityMru(mruData: CoreInterfaces.IdentityData, mruName: string, onResult: (err: any, statusCode: number) => void): void;
	    deleteIdentityMru(mruData: CoreInterfaces.IdentityData, mruName: string, onResult: (err: any, statusCode: number) => void): void;
	    getIdentityMru(mruName: string, onResult: (err: any, statusCode: number, identityMru: VSSInterfaces.IdentityRef[]) => void): void;
	    updateIdentityMru(mruData: CoreInterfaces.IdentityData, mruName: string, onResult: (err: any, statusCode: number) => void): void;
	    getTeamMembers(projectId: string, teamId: string, top: number, skip: number, onResult: (err: any, statusCode: number, members: VSSInterfaces.IdentityRef[]) => void): void;
	    getProcessById(processId: string, onResult: (err: any, statusCode: number, processe: CoreInterfaces.Process) => void): void;
	    getProcesses(onResult: (err: any, statusCode: number, processes: CoreInterfaces.Process[]) => void): void;
	    getProjectCollection(collectionId: string, onResult: (err: any, statusCode: number, projectCollection: CoreInterfaces.TeamProjectCollection) => void): void;
	    getProjectCollections(top: number, skip: number, onResult: (err: any, statusCode: number, projectCollections: CoreInterfaces.TeamProjectCollectionReference[]) => void): void;
	    getProjectHistory(minRevision: number, onResult: (err: any, statusCode: number, projectHistory: CoreInterfaces.TeamProjectReference[]) => void): void;
	    getProject(projectId: string, includeCapabilities: boolean, includeHistory: boolean, onResult: (err: any, statusCode: number, project: CoreInterfaces.TeamProject) => void): void;
	    getProjects(stateFilter: any, top: number, skip: number, onResult: (err: any, statusCode: number, projects: CoreInterfaces.TeamProjectReference[]) => void): void;
	    queueCreateProject(projectToCreate: CoreInterfaces.TeamProject, onResult: (err: any, statusCode: number, project: OperationsInterfaces.OperationReference) => void): void;
	    queueDeleteProject(projectId: string, onResult: (err: any, statusCode: number, project: OperationsInterfaces.OperationReference) => void): void;
	    updateProject(projectUpdate: CoreInterfaces.TeamProject, projectId: string, onResult: (err: any, statusCode: number, project: OperationsInterfaces.OperationReference) => void): void;
	    getProxies(proxyUrl: string, onResult: (err: any, statusCode: number, proxies: CoreInterfaces.Proxy[]) => void): void;
	    createTeam(team: CoreInterfaces.WebApiTeam, projectId: string, onResult: (err: any, statusCode: number, team: CoreInterfaces.WebApiTeam) => void): void;
	    deleteTeam(projectId: string, teamId: string, onResult: (err: any, statusCode: number) => void): void;
	    getTeam(projectId: string, teamId: string, onResult: (err: any, statusCode: number, team: CoreInterfaces.WebApiTeam) => void): void;
	    getTeams(projectId: string, top: number, skip: number, onResult: (err: any, statusCode: number, teams: CoreInterfaces.WebApiTeam[]) => void): void;
	    updateTeam(teamData: CoreInterfaces.WebApiTeam, projectId: string, teamId: string, onResult: (err: any, statusCode: number, team: CoreInterfaces.WebApiTeam) => void): void;
	}
	export interface IQCoreApi extends basem.QClientApiBase {
	    createConnectedService(connectedServiceCreationData: CoreInterfaces.WebApiConnectedServiceDetails, projectId: string): Q.Promise<CoreInterfaces.WebApiConnectedService>;
	    getConnectedServiceDetails(projectId: string, name: string): Q.Promise<CoreInterfaces.WebApiConnectedServiceDetails>;
	    getConnectedServices(projectId: string, kind?: CoreInterfaces.ConnectedServiceKind): Q.Promise<CoreInterfaces.WebApiConnectedService[]>;
	    createIdentityMru(mruData: CoreInterfaces.IdentityData, mruName: string): Q.Promise<void>;
	    deleteIdentityMru(mruData: CoreInterfaces.IdentityData, mruName: string): Q.Promise<void>;
	    getIdentityMru(mruName: string): Q.Promise<VSSInterfaces.IdentityRef[]>;
	    updateIdentityMru(mruData: CoreInterfaces.IdentityData, mruName: string): Q.Promise<void>;
	    getTeamMembers(projectId: string, teamId: string, top?: number, skip?: number): Q.Promise<VSSInterfaces.IdentityRef[]>;
	    getProcessById(processId: string): Q.Promise<CoreInterfaces.Process>;
	    getProcesses(): Q.Promise<CoreInterfaces.Process[]>;
	    getProjectCollection(collectionId: string): Q.Promise<CoreInterfaces.TeamProjectCollection>;
	    getProjectCollections(top?: number, skip?: number): Q.Promise<CoreInterfaces.TeamProjectCollectionReference[]>;
	    getProjectHistory(minRevision?: number): Q.Promise<CoreInterfaces.TeamProjectReference[]>;
	    getProject(projectId: string, includeCapabilities?: boolean, includeHistory?: boolean): Q.Promise<CoreInterfaces.TeamProject>;
	    getProjects(stateFilter?: any, top?: number, skip?: number): Q.Promise<CoreInterfaces.TeamProjectReference[]>;
	    queueCreateProject(projectToCreate: CoreInterfaces.TeamProject): Q.Promise<OperationsInterfaces.OperationReference>;
	    queueDeleteProject(projectId: string): Q.Promise<OperationsInterfaces.OperationReference>;
	    updateProject(projectUpdate: CoreInterfaces.TeamProject, projectId: string): Q.Promise<OperationsInterfaces.OperationReference>;
	    getProxies(proxyUrl?: string): Q.Promise<CoreInterfaces.Proxy[]>;
	    createTeam(team: CoreInterfaces.WebApiTeam, projectId: string): Q.Promise<CoreInterfaces.WebApiTeam>;
	    deleteTeam(projectId: string, teamId: string): Q.Promise<void>;
	    getTeam(projectId: string, teamId: string): Q.Promise<CoreInterfaces.WebApiTeam>;
	    getTeams(projectId: string, top?: number, skip?: number): Q.Promise<CoreInterfaces.WebApiTeam[]>;
	    updateTeam(teamData: CoreInterfaces.WebApiTeam, projectId: string, teamId: string): Q.Promise<CoreInterfaces.WebApiTeam>;
	}
	export class CoreApi extends basem.ClientApiBase implements ICoreApi {
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	     * @param {CoreInterfaces.WebApiConnectedServiceDetails} connectedServiceCreationData
	     * @param {string} projectId
	     * @param onResult callback function with the resulting CoreInterfaces.WebApiConnectedService
	     */
	    createConnectedService(connectedServiceCreationData: CoreInterfaces.WebApiConnectedServiceDetails, projectId: string, onResult: (err: any, statusCode: number, connectedService: CoreInterfaces.WebApiConnectedService) => void): void;
	    /**
	     * @param {string} projectId
	     * @param {string} name
	     * @param onResult callback function with the resulting CoreInterfaces.WebApiConnectedServiceDetails
	     */
	    getConnectedServiceDetails(projectId: string, name: string, onResult: (err: any, statusCode: number, connectedService: CoreInterfaces.WebApiConnectedServiceDetails) => void): void;
	    /**
	     * @param {string} projectId
	     * @param {CoreInterfaces.ConnectedServiceKind} kind
	     * @param onResult callback function with the resulting CoreInterfaces.WebApiConnectedService[]
	     */
	    getConnectedServices(projectId: string, kind: CoreInterfaces.ConnectedServiceKind, onResult: (err: any, statusCode: number, connectedServices: CoreInterfaces.WebApiConnectedService[]) => void): void;
	    /**
	     * @param {CoreInterfaces.IdentityData} mruData
	     * @param {string} mruName
	     * @param onResult callback function
	     */
	    createIdentityMru(mruData: CoreInterfaces.IdentityData, mruName: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {CoreInterfaces.IdentityData} mruData
	     * @param {string} mruName
	     * @param onResult callback function
	     */
	    deleteIdentityMru(mruData: CoreInterfaces.IdentityData, mruName: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} mruName
	     * @param onResult callback function with the resulting VSSInterfaces.IdentityRef[]
	     */
	    getIdentityMru(mruName: string, onResult: (err: any, statusCode: number, identityMru: VSSInterfaces.IdentityRef[]) => void): void;
	    /**
	     * @param {CoreInterfaces.IdentityData} mruData
	     * @param {string} mruName
	     * @param onResult callback function
	     */
	    updateIdentityMru(mruData: CoreInterfaces.IdentityData, mruName: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} projectId
	     * @param {string} teamId
	     * @param {number} top
	     * @param {number} skip
	     * @param onResult callback function with the resulting VSSInterfaces.IdentityRef[]
	     */
	    getTeamMembers(projectId: string, teamId: string, top: number, skip: number, onResult: (err: any, statusCode: number, members: VSSInterfaces.IdentityRef[]) => void): void;
	    /**
	     * Retrieve process by id
	     *
	     * @param {string} processId
	     * @param onResult callback function with the resulting CoreInterfaces.Process
	     */
	    getProcessById(processId: string, onResult: (err: any, statusCode: number, processe: CoreInterfaces.Process) => void): void;
	    /**
	     * @param onResult callback function with the resulting CoreInterfaces.Process[]
	     */
	    getProcesses(onResult: (err: any, statusCode: number, processes: CoreInterfaces.Process[]) => void): void;
	    /**
	     * Get project collection with the specified id or name.
	     *
	     * @param {string} collectionId
	     * @param onResult callback function with the resulting CoreInterfaces.TeamProjectCollection
	     */
	    getProjectCollection(collectionId: string, onResult: (err: any, statusCode: number, projectCollection: CoreInterfaces.TeamProjectCollection) => void): void;
	    /**
	     * Get project collection references for this application.
	     *
	     * @param {number} top
	     * @param {number} skip
	     * @param onResult callback function with the resulting CoreInterfaces.TeamProjectCollectionReference[]
	     */
	    getProjectCollections(top: number, skip: number, onResult: (err: any, statusCode: number, projectCollections: CoreInterfaces.TeamProjectCollectionReference[]) => void): void;
	    /**
	     * @param {number} minRevision
	     * @param onResult callback function with the resulting CoreInterfaces.TeamProjectReference[]
	     */
	    getProjectHistory(minRevision: number, onResult: (err: any, statusCode: number, projectHistory: CoreInterfaces.TeamProjectReference[]) => void): void;
	    /**
	     * Get project with the specified id or name, optionally including capabilities.
	     *
	     * @param {string} projectId
	     * @param {boolean} includeCapabilities - Include capabilities (such as source control) in the team project result (default: false).
	     * @param {boolean} includeHistory - Search within renamed projects (that had such name in the past).
	     * @param onResult callback function with the resulting CoreInterfaces.TeamProject
	     */
	    getProject(projectId: string, includeCapabilities: boolean, includeHistory: boolean, onResult: (err: any, statusCode: number, project: CoreInterfaces.TeamProject) => void): void;
	    /**
	     * Get project references with the specified state
	     *
	     * @param {any} stateFilter - Filter on team projects in a specific team project state (default: WellFormed).
	     * @param {number} top
	     * @param {number} skip
	     * @param onResult callback function with the resulting CoreInterfaces.TeamProjectReference[]
	     */
	    getProjects(stateFilter: any, top: number, skip: number, onResult: (err: any, statusCode: number, projects: CoreInterfaces.TeamProjectReference[]) => void): void;
	    /**
	     * Queue a project creation.
	     *
	     * @param {CoreInterfaces.TeamProject} projectToCreate - The project to create.
	     * @param onResult callback function with the resulting OperationsInterfaces.OperationReference
	     */
	    queueCreateProject(projectToCreate: CoreInterfaces.TeamProject, onResult: (err: any, statusCode: number, project: OperationsInterfaces.OperationReference) => void): void;
	    /**
	     * Queue a project deletion.
	     *
	     * @param {string} projectId - The project id of the project to delete.
	     * @param onResult callback function with the resulting OperationsInterfaces.OperationReference
	     */
	    queueDeleteProject(projectId: string, onResult: (err: any, statusCode: number, project: OperationsInterfaces.OperationReference) => void): void;
	    /**
	     * Update an existing project's name, abbreviation, or description.
	     *
	     * @param {CoreInterfaces.TeamProject} projectUpdate - The updates for the project.
	     * @param {string} projectId - The project id of the project to update.
	     * @param onResult callback function with the resulting OperationsInterfaces.OperationReference
	     */
	    updateProject(projectUpdate: CoreInterfaces.TeamProject, projectId: string, onResult: (err: any, statusCode: number, project: OperationsInterfaces.OperationReference) => void): void;
	    /**
	     * @param {string} proxyUrl
	     * @param onResult callback function with the resulting CoreInterfaces.Proxy[]
	     */
	    getProxies(proxyUrl: string, onResult: (err: any, statusCode: number, proxies: CoreInterfaces.Proxy[]) => void): void;
	    /**
	     * Creates a team
	     *
	     * @param {CoreInterfaces.WebApiTeam} team - The team data used to create the team.
	     * @param {string} projectId - The name or id (GUID) of the team project in which to create the team.
	     * @param onResult callback function with the resulting CoreInterfaces.WebApiTeam
	     */
	    createTeam(team: CoreInterfaces.WebApiTeam, projectId: string, onResult: (err: any, statusCode: number, team: CoreInterfaces.WebApiTeam) => void): void;
	    /**
	     * Deletes a team
	     *
	     * @param {string} projectId - The name or id (GUID) of the team project containing the team to delete.
	     * @param {string} teamId - The name of id of the team to delete.
	     * @param onResult callback function
	     */
	    deleteTeam(projectId: string, teamId: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * Gets a team
	     *
	     * @param {string} projectId
	     * @param {string} teamId
	     * @param onResult callback function with the resulting CoreInterfaces.WebApiTeam
	     */
	    getTeam(projectId: string, teamId: string, onResult: (err: any, statusCode: number, team: CoreInterfaces.WebApiTeam) => void): void;
	    /**
	     * @param {string} projectId
	     * @param {number} top
	     * @param {number} skip
	     * @param onResult callback function with the resulting CoreInterfaces.WebApiTeam[]
	     */
	    getTeams(projectId: string, top: number, skip: number, onResult: (err: any, statusCode: number, teams: CoreInterfaces.WebApiTeam[]) => void): void;
	    /**
	     * Updates a team's name and/or description
	     *
	     * @param {CoreInterfaces.WebApiTeam} teamData
	     * @param {string} projectId - The name or id (GUID) of the team project containing the team to update.
	     * @param {string} teamId - The name of id of the team to update.
	     * @param onResult callback function with the resulting CoreInterfaces.WebApiTeam
	     */
	    updateTeam(teamData: CoreInterfaces.WebApiTeam, projectId: string, teamId: string, onResult: (err: any, statusCode: number, team: CoreInterfaces.WebApiTeam) => void): void;
	}
	export class QCoreApi extends basem.QClientApiBase implements IQCoreApi {
	    api: CoreApi;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	    * @param {CoreInterfaces.WebApiConnectedServiceDetails} connectedServiceCreationData
	    * @param {string} projectId
	    */
	    createConnectedService(connectedServiceCreationData: CoreInterfaces.WebApiConnectedServiceDetails, projectId: string): Q.Promise<CoreInterfaces.WebApiConnectedService>;
	    /**
	    * @param {string} projectId
	    * @param {string} name
	    */
	    getConnectedServiceDetails(projectId: string, name: string): Q.Promise<CoreInterfaces.WebApiConnectedServiceDetails>;
	    /**
	    * @param {string} projectId
	    * @param {CoreInterfaces.ConnectedServiceKind} kind
	    */
	    getConnectedServices(projectId: string, kind?: CoreInterfaces.ConnectedServiceKind): Q.Promise<CoreInterfaces.WebApiConnectedService[]>;
	    /**
	    * @param {CoreInterfaces.IdentityData} mruData
	    * @param {string} mruName
	    */
	    createIdentityMru(mruData: CoreInterfaces.IdentityData, mruName: string): Q.Promise<void>;
	    /**
	    * @param {CoreInterfaces.IdentityData} mruData
	    * @param {string} mruName
	    */
	    deleteIdentityMru(mruData: CoreInterfaces.IdentityData, mruName: string): Q.Promise<void>;
	    /**
	    * @param {string} mruName
	    */
	    getIdentityMru(mruName: string): Q.Promise<VSSInterfaces.IdentityRef[]>;
	    /**
	    * @param {CoreInterfaces.IdentityData} mruData
	    * @param {string} mruName
	    */
	    updateIdentityMru(mruData: CoreInterfaces.IdentityData, mruName: string): Q.Promise<void>;
	    /**
	    * @param {string} projectId
	    * @param {string} teamId
	    * @param {number} top
	    * @param {number} skip
	    */
	    getTeamMembers(projectId: string, teamId: string, top?: number, skip?: number): Q.Promise<VSSInterfaces.IdentityRef[]>;
	    /**
	    * Retrieve process by id
	    *
	    * @param {string} processId
	    */
	    getProcessById(processId: string): Q.Promise<CoreInterfaces.Process>;
	    /**
	    */
	    getProcesses(): Q.Promise<CoreInterfaces.Process[]>;
	    /**
	    * Get project collection with the specified id or name.
	    *
	    * @param {string} collectionId
	    */
	    getProjectCollection(collectionId: string): Q.Promise<CoreInterfaces.TeamProjectCollection>;
	    /**
	    * Get project collection references for this application.
	    *
	    * @param {number} top
	    * @param {number} skip
	    */
	    getProjectCollections(top?: number, skip?: number): Q.Promise<CoreInterfaces.TeamProjectCollectionReference[]>;
	    /**
	    * @param {number} minRevision
	    */
	    getProjectHistory(minRevision?: number): Q.Promise<CoreInterfaces.TeamProjectReference[]>;
	    /**
	    * Get project with the specified id or name, optionally including capabilities.
	    *
	    * @param {string} projectId
	    * @param {boolean} includeCapabilities - Include capabilities (such as source control) in the team project result (default: false).
	    * @param {boolean} includeHistory - Search within renamed projects (that had such name in the past).
	    */
	    getProject(projectId: string, includeCapabilities?: boolean, includeHistory?: boolean): Q.Promise<CoreInterfaces.TeamProject>;
	    /**
	    * Get project references with the specified state
	    *
	    * @param {any} stateFilter - Filter on team projects in a specific team project state (default: WellFormed).
	    * @param {number} top
	    * @param {number} skip
	    */
	    getProjects(stateFilter?: any, top?: number, skip?: number): Q.Promise<CoreInterfaces.TeamProjectReference[]>;
	    /**
	    * Queue a project creation.
	    *
	    * @param {CoreInterfaces.TeamProject} projectToCreate - The project to create.
	    */
	    queueCreateProject(projectToCreate: CoreInterfaces.TeamProject): Q.Promise<OperationsInterfaces.OperationReference>;
	    /**
	    * Queue a project deletion.
	    *
	    * @param {string} projectId - The project id of the project to delete.
	    */
	    queueDeleteProject(projectId: string): Q.Promise<OperationsInterfaces.OperationReference>;
	    /**
	    * Update an existing project's name, abbreviation, or description.
	    *
	    * @param {CoreInterfaces.TeamProject} projectUpdate - The updates for the project.
	    * @param {string} projectId - The project id of the project to update.
	    */
	    updateProject(projectUpdate: CoreInterfaces.TeamProject, projectId: string): Q.Promise<OperationsInterfaces.OperationReference>;
	    /**
	    * @param {string} proxyUrl
	    */
	    getProxies(proxyUrl?: string): Q.Promise<CoreInterfaces.Proxy[]>;
	    /**
	    * Creates a team
	    *
	    * @param {CoreInterfaces.WebApiTeam} team - The team data used to create the team.
	    * @param {string} projectId - The name or id (GUID) of the team project in which to create the team.
	    */
	    createTeam(team: CoreInterfaces.WebApiTeam, projectId: string): Q.Promise<CoreInterfaces.WebApiTeam>;
	    /**
	    * Deletes a team
	    *
	    * @param {string} projectId - The name or id (GUID) of the team project containing the team to delete.
	    * @param {string} teamId - The name of id of the team to delete.
	    */
	    deleteTeam(projectId: string, teamId: string): Q.Promise<void>;
	    /**
	    * Gets a team
	    *
	    * @param {string} projectId
	    * @param {string} teamId
	    */
	    getTeam(projectId: string, teamId: string): Q.Promise<CoreInterfaces.WebApiTeam>;
	    /**
	    * @param {string} projectId
	    * @param {number} top
	    * @param {number} skip
	    */
	    getTeams(projectId: string, top?: number, skip?: number): Q.Promise<CoreInterfaces.WebApiTeam[]>;
	    /**
	    * Updates a team's name and/or description
	    *
	    * @param {CoreInterfaces.WebApiTeam} teamData
	    * @param {string} projectId - The name or id (GUID) of the team project containing the team to update.
	    * @param {string} teamId - The name of id of the team to update.
	    */
	    updateTeam(teamData: CoreInterfaces.WebApiTeam, projectId: string, teamId: string): Q.Promise<CoreInterfaces.WebApiTeam>;
	}

}
declare module 'vso-node-api/interfaces/FileContainerInterfaces' {
	export enum ContainerItemStatus {
	    /**
	     * Item is created.
	     */
	    Created = 1,
	    /**
	     * Item is a file pending for upload.
	     */
	    PendingUpload = 2,
	}
	export enum ContainerItemType {
	    /**
	     * Any item type.
	     */
	    Any = 0,
	    /**
	     * Item is a folder which can have child items.
	     */
	    Folder = 1,
	    /**
	     * Item is a file which is stored in the file service.
	     */
	    File = 2,
	}
	export enum ContainerOptions {
	    /**
	     * No option.
	     */
	    None = 0,
	}
	/**
	 * Represents a container that encapsulates a hierarchical file system.
	 */
	export interface FileContainer {
	    /**
	     * Uri of the artifact associated with the container.
	     */
	    artifactUri: string;
	    /**
	     * Download Url for the content of this item.
	     */
	    contentLocation: string;
	    /**
	     * Owner.
	     */
	    createdBy: string;
	    /**
	     * Creation date.
	     */
	    dateCreated: Date;
	    /**
	     * Description.
	     */
	    description: string;
	    /**
	     * Id.
	     */
	    id: number;
	    /**
	     * Location of the item resource.
	     */
	    itemLocation: string;
	    /**
	     * Name.
	     */
	    name: string;
	    /**
	     * Options the container can have.
	     */
	    options: ContainerOptions;
	    /**
	     * Project Id.
	     */
	    scopeIdentifier: string;
	    /**
	     * Security token of the artifact associated with the container.
	     */
	    securityToken: string;
	    /**
	     * Identifier of the optional encryption key.
	     */
	    signingKeyId: string;
	    /**
	     * Total size of the files in bytes.
	     */
	    size: number;
	}
	/**
	 * Represents an item in a container.
	 */
	export interface FileContainerItem {
	    /**
	     * Container Id.
	     */
	    containerId: number;
	    contentId: number[];
	    /**
	     * Download Url for the content of this item.
	     */
	    contentLocation: string;
	    /**
	     * Creator.
	     */
	    createdBy: string;
	    /**
	     * Creation date.
	     */
	    dateCreated: Date;
	    /**
	     * Last modified date.
	     */
	    dateLastModified: Date;
	    /**
	     * Encoding of the file. Zero if not a file.
	     */
	    fileEncoding: number;
	    /**
	     * Hash value of the file. Null if not a file.
	     */
	    fileHash: number[];
	    /**
	     * Length of the file. Zero if not of a file.
	     */
	    fileLength: number;
	    /**
	     * Type of the file. Zero if not a file.
	     */
	    fileType: number;
	    /**
	     * Location of the item resource.
	     */
	    itemLocation: string;
	    /**
	     * Type of the item: Folder, File or String.
	     */
	    itemType: ContainerItemType;
	    /**
	     * Modifier.
	     */
	    lastModifiedBy: string;
	    /**
	     * Unique path that identifies the item.
	     */
	    path: string;
	    /**
	     * Project Id.
	     */
	    scopeIdentifier: string;
	    /**
	     * Status of the item: Created or Pending Upload.
	     */
	    status: ContainerItemStatus;
	    ticket: string;
	}
	export var TypeInfo: {
	    ContainerItemStatus: {
	        enumValues: {
	            "created": number;
	            "pendingUpload": number;
	        };
	    };
	    ContainerItemType: {
	        enumValues: {
	            "any": number;
	            "folder": number;
	            "file": number;
	        };
	    };
	    ContainerOptions: {
	        enumValues: {
	            "none": number;
	        };
	    };
	    FileContainer: {
	        fields: any;
	    };
	    FileContainerItem: {
	        fields: any;
	    };
	};

}
declare module 'vso-node-api/FileContainerApiBase' {
	/// <reference path="../node/node.d.ts" />
	/// <reference path="../q/Q.d.ts" />
	import Q = require('q');
	import basem = require('vso-node-api/ClientApiBases');
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	import FileContainerInterfaces = require('vso-node-api/interfaces/FileContainerInterfaces');
	import VSSInterfaces = require('vso-node-api/interfaces/common/VSSInterfaces');
	export interface IFileContainerApiBase extends basem.ClientApiBase {
	    createItems(items: VSSInterfaces.VssJsonCollectionWrapperV<FileContainerInterfaces.FileContainerItem[]>, containerId: number, scope: string, onResult: (err: any, statusCode: number, Container: FileContainerInterfaces.FileContainerItem[]) => void): void;
	    deleteItem(containerId: number, itemPath: string, scope: string, onResult: (err: any, statusCode: number) => void): void;
	    getContainers(scope: string, artifactUris: string, onResult: (err: any, statusCode: number, Containers: FileContainerInterfaces.FileContainer[]) => void): void;
	    getItems(containerId: number, scope: string, itemPath: string, metadata: boolean, format: string, downloadFileName: string, includeDownloadTickets: boolean, isShallow: boolean, onResult: (err: any, statusCode: number, Containers: FileContainerInterfaces.FileContainerItem[]) => void): void;
	    browseItems(container: number, itemPath: string, onResult: (err: any, statusCode: number, Containers: FileContainerInterfaces.FileContainerItem[]) => void): void;
	}
	export interface IQFileContainerApiBase extends basem.QClientApiBase {
	    createItems(items: VSSInterfaces.VssJsonCollectionWrapperV<FileContainerInterfaces.FileContainerItem[]>, containerId: number, scope?: string): Q.Promise<FileContainerInterfaces.FileContainerItem[]>;
	    deleteItem(containerId: number, itemPath: string, scope?: string): Q.Promise<void>;
	    getContainers(scope?: string, artifactUris?: string): Q.Promise<FileContainerInterfaces.FileContainer[]>;
	    getItems(containerId: number, scope?: string, itemPath?: string, metadata?: boolean, format?: string, downloadFileName?: string, includeDownloadTickets?: boolean, isShallow?: boolean): Q.Promise<FileContainerInterfaces.FileContainerItem[]>;
	    browseItems(container: number, itemPath?: string): Q.Promise<FileContainerInterfaces.FileContainerItem[]>;
	}
	export class FileContainerApiBase extends basem.ClientApiBase implements IFileContainerApiBase {
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	     * Creates the specified items in in the referenced container.
	     *
	     * @param {VSSInterfaces.VssJsonCollectionWrapperV<FileContainerInterfaces.FileContainerItem[]>} items
	     * @param {number} containerId
	     * @param {string} scope - A guid representing the scope of the container. This is often the project id.
	     * @param onResult callback function with the resulting FileContainerInterfaces.FileContainerItem[]
	     */
	    createItems(items: VSSInterfaces.VssJsonCollectionWrapperV<FileContainerInterfaces.FileContainerItem[]>, containerId: number, scope: string, onResult: (err: any, statusCode: number, Container: FileContainerInterfaces.FileContainerItem[]) => void): void;
	    /**
	     * Deletes the specified items in a container.
	     *
	     * @param {number} containerId - Container Id.
	     * @param {string} itemPath - Path to delete.
	     * @param {string} scope - A guid representing the scope of the container. This is often the project id.
	     * @param onResult callback function
	     */
	    deleteItem(containerId: number, itemPath: string, scope: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * Gets containers filtered by a comma separated list of artifact uris within the same scope, if not specified returns all containers
	     *
	     * @param {string} scope - A guid representing the scope of the container. This is often the project id.
	     * @param {string} artifactUris
	     * @param onResult callback function with the resulting FileContainerInterfaces.FileContainer[]
	     */
	    getContainers(scope: string, artifactUris: string, onResult: (err: any, statusCode: number, Containers: FileContainerInterfaces.FileContainer[]) => void): void;
	    /**
	     * @param {number} containerId
	     * @param {string} scope
	     * @param {string} itemPath
	     * @param {boolean} metadata
	     * @param {string} format
	     * @param {string} downloadFileName
	     * @param {boolean} includeDownloadTickets
	     * @param {boolean} isShallow
	     * @param onResult callback function with the resulting FileContainerInterfaces.FileContainerItem[]
	     */
	    getItems(containerId: number, scope: string, itemPath: string, metadata: boolean, format: string, downloadFileName: string, includeDownloadTickets: boolean, isShallow: boolean, onResult: (err: any, statusCode: number, Containers: FileContainerInterfaces.FileContainerItem[]) => void): void;
	    /**
	     * Allow browsing of file ,the contentDisposition is inline and Content-Type is determined by FileExtension
	     *
	     * @param {number} container
	     * @param {string} itemPath - The path to the item of interest
	     * @param onResult callback function with the resulting FileContainerInterfaces.FileContainerItem[]
	     */
	    browseItems(container: number, itemPath: string, onResult: (err: any, statusCode: number, Containers: FileContainerInterfaces.FileContainerItem[]) => void): void;
	}
	export class QFileContainerApiBase extends basem.QClientApiBase implements IQFileContainerApiBase {
	    api: FileContainerApiBase;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[], api: typeof basem.ClientApiBase);
	    /**
	    * Creates the specified items in in the referenced container.
	    *
	    * @param {VSSInterfaces.VssJsonCollectionWrapperV<FileContainerInterfaces.FileContainerItem[]>} items
	    * @param {number} containerId
	    * @param {string} scope - A guid representing the scope of the container. This is often the project id.
	    */
	    createItems(items: VSSInterfaces.VssJsonCollectionWrapperV<FileContainerInterfaces.FileContainerItem[]>, containerId: number, scope?: string): Q.Promise<FileContainerInterfaces.FileContainerItem[]>;
	    /**
	    * Deletes the specified items in a container.
	    *
	    * @param {number} containerId - Container Id.
	    * @param {string} itemPath - Path to delete.
	    * @param {string} scope - A guid representing the scope of the container. This is often the project id.
	    */
	    deleteItem(containerId: number, itemPath: string, scope?: string): Q.Promise<void>;
	    /**
	    * Gets containers filtered by a comma separated list of artifact uris within the same scope, if not specified returns all containers
	    *
	    * @param {string} scope - A guid representing the scope of the container. This is often the project id.
	    * @param {string} artifactUris
	    */
	    getContainers(scope?: string, artifactUris?: string): Q.Promise<FileContainerInterfaces.FileContainer[]>;
	    /**
	    * @param {number} containerId
	    * @param {string} scope
	    * @param {string} itemPath
	    * @param {boolean} metadata
	    * @param {string} format
	    * @param {string} downloadFileName
	    * @param {boolean} includeDownloadTickets
	    * @param {boolean} isShallow
	    */
	    getItems(containerId: number, scope?: string, itemPath?: string, metadata?: boolean, format?: string, downloadFileName?: string, includeDownloadTickets?: boolean, isShallow?: boolean): Q.Promise<FileContainerInterfaces.FileContainerItem[]>;
	    /**
	    * Allow browsing of file ,the contentDisposition is inline and Content-Type is determined by FileExtension
	    *
	    * @param {number} container
	    * @param {string} itemPath - The path to the item of interest
	    */
	    browseItems(container: number, itemPath?: string): Q.Promise<FileContainerInterfaces.FileContainerItem[]>;
	}

}
declare module 'vso-node-api/FileContainerApi' {
	/// <reference path="../node/node.d.ts" />
	/// <reference path="../q/Q.d.ts" />
	import Q = require('q');
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	import FileContainerApiBase = require('vso-node-api/FileContainerApiBase');
	import FileContainerInterfaces = require('vso-node-api/interfaces/FileContainerInterfaces');
	export interface IFileContainerApi extends FileContainerApiBase.IFileContainerApiBase {
	    createItem(contentStream: NodeJS.ReadableStream, uncompressedLength: number, containerId: number, itemPath: string, scope: string, options: any, onResult: (err: any, statusCode: number, Container: FileContainerInterfaces.FileContainerItem) => void): void;
	}
	export interface IQFileContainerApi extends FileContainerApiBase.IQFileContainerApiBase {
	    createItem(contentStream: NodeJS.ReadableStream, uncompressedLength: number, containerId: number, itemPath: string, scope: string, options: any): Q.Promise<FileContainerInterfaces.FileContainerItem>;
	}
	export class FileContainerApi extends FileContainerApiBase.FileContainerApiBase implements IFileContainerApi {
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    createItem(contentStream: NodeJS.ReadableStream, uncompressedLength: number, containerId: number, itemPath: string, scope: string, options: any, onResult: (err: any, statusCode: number, Container: FileContainerInterfaces.FileContainerItem) => void): void;
	    _createItem(customHeaders: VsoBaseInterfaces.IHeaders, contentStream: NodeJS.ReadableStream, containerId: number, itemPath: string, scope: string, onResult: (err: any, statusCode: number, Container: FileContainerInterfaces.FileContainerItem) => void): void;
	}
	export class QFileContainerApi extends FileContainerApiBase.QFileContainerApiBase implements IQFileContainerApi {
	    api: FileContainerApi;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    createItem(contentStream: NodeJS.ReadableStream, uncompressedLength: number, containerId: number, itemPath: string, scope: string, options: any): Q.Promise<FileContainerInterfaces.FileContainerItem>;
	}

}
declare module 'vso-node-api/interfaces/GalleryInterfaces' {
	export enum AcquisitionAssignmentType {
	    None = 0,
	    /**
	     * Just assign for me
	     */
	    Me = 1,
	    /**
	     * Assign for all users in the account
	     */
	    All = 2,
	}
	export interface AcquisitionOperation {
	    /**
	     * State of the the AcquisitionOperation for the current user
	     */
	    operationState: AcquisitionOperationState;
	    /**
	     * AcquisitionOperationType: install, request, buy, etc...
	     */
	    operationType: AcquisitionOperationType;
	    /**
	     * Optional reason to justify current state. Typically used with Disallow state.
	     */
	    reason: string;
	}
	export enum AcquisitionOperationState {
	    /**
	     * Not allowed to use this AcquisitionOperation
	     */
	    Disallow = 0,
	    /**
	     * Allowed to use this AcquisitionOperation
	     */
	    Allow = 1,
	    /**
	     * Operation has already been completed and is no longer available
	     */
	    Completed = 3,
	}
	export enum AcquisitionOperationType {
	    /**
	     * Not yet used
	     */
	    Get = 0,
	    /**
	     * Install this extension into the host provided
	     */
	    Install = 1,
	    /**
	     * Buy licenses for this extension and install into the host provided
	     */
	    Buy = 2,
	    /**
	     * Not yet used
	     */
	    Try = 3,
	    /**
	     * Not yet used
	     */
	    Request = 4,
	    /**
	     * No action found
	     */
	    None = 5,
	}
	/**
	 * Market item acquisition options (install, buy, etc) for an installation target.
	 */
	export interface AcquisitionOptions {
	    /**
	     * Default Operation for the ItemId in this target
	     */
	    defaultOperation: AcquisitionOperation;
	    /**
	     * The item id that this options refer to
	     */
	    itemId: string;
	    /**
	     * Operations allowed for the ItemId in this target
	     */
	    operations: AcquisitionOperation[];
	    /**
	     * The target that this options refer to
	     */
	    target: string;
	}
	export enum ConcernCategory {
	    General = 1,
	    Abusive = 2,
	    Spam = 4,
	}
	/**
	 * Contract for handling the extension acquisition process
	 */
	export interface ExtensionAcquisitionRequest {
	    /**
	     * How the item is being assigned
	     */
	    assignmentType: AcquisitionAssignmentType;
	    /**
	     * The id of the subscription used for purchase
	     */
	    billingId: string;
	    /**
	     * The marketplace id (publisherName.extensionName) for the item
	     */
	    itemId: string;
	    /**
	     * The type of operation, such as install, request, purchase
	     */
	    operationType: AcquisitionOperationType;
	    /**
	     * Additional properties which can be added to the request.
	     */
	    properties: any;
	    /**
	     * How many licenses should be purchased
	     */
	    quantity: number;
	    /**
	     * A list of target guids where the item should be acquired (installed, requested, etc.), such as account id
	     */
	    targets: string[];
	}
	export interface ExtensionFile {
	    assetType: string;
	    contentType: string;
	    fileId: number;
	    isDefault: boolean;
	    isPublic: boolean;
	    language: string;
	    shortDescription: string;
	    source: string;
	    version: string;
	}
	/**
	 * The FilterResult is the set of extensions that matched a particular query filter.
	 */
	export interface ExtensionFilterResult {
	    /**
	     * This is the set of appplications that matched the query filter supplied.
	     */
	    extensions: PublishedExtension[];
	    /**
	     * The PagingToken is returned from a request when more records exist that match the result than were requested or could be returned. A follow-up query with this paging token can be used to retrieve more results.
	     */
	    pagingToken: string;
	    /**
	     * This is the additional optional metadata for the given result. E.g. Total count of results which is useful in case of paged results
	     */
	    resultMetadata: ExtensionFilterResultMetadata[];
	}
	/**
	 * ExtensionFilterResultMetadata is one set of metadata for the result e.g. Total count. There can be multiple metadata items for one metadata.
	 */
	export interface ExtensionFilterResultMetadata {
	    /**
	     * The metadata items for the category
	     */
	    metadataItems: MetadataItem[];
	    /**
	     * Defines the category of metadata items
	     */
	    metadataType: string;
	}
	/**
	 * Represents the component pieces of an extensions fully qualified name, along with the fully qualified name.
	 */
	export interface ExtensionIdentifier {
	    /**
	     * The ExtensionName component part of the fully qualified ExtensionIdentifier
	     */
	    extensionName: string;
	    /**
	     * The PublisherName component part of the fully qualified ExtensionIdentifier
	     */
	    publisherName: string;
	}
	/**
	 * Package that will be used to create or update a published extension
	 */
	export interface ExtensionPackage {
	    /**
	     * Base 64 encoded extension package
	     */
	    extensionManifest: string;
	}
	/**
	 * Policy with a set of permissions on extension operations
	 */
	export interface ExtensionPolicy {
	    /**
	     * Permissions on 'Install' operation
	     */
	    install: ExtensionPolicyFlags;
	    /**
	     * Permission on 'Request' operation
	     */
	    request: ExtensionPolicyFlags;
	}
	export enum ExtensionPolicyFlags {
	    /**
	     * No permission
	     */
	    None = 0,
	    /**
	     * Permission on private extensions
	     */
	    Private = 1,
	    /**
	     * Permission on public extensions
	     */
	    Public = 2,
	    /**
	     * Premission in extensions that are in preview
	     */
	    Preview = 4,
	    /**
	     * Premission in relased extensions
	     */
	    Released = 8,
	    /**
	     * Permission in 1st party extensions
	     */
	    FirstParty = 16,
	    /**
	     * Mask that defines all permissions
	     */
	    All = 31,
	}
	/**
	 * An ExtensionQuery is used to search the gallery for a set of extensions that match one of many filter values.
	 */
	export interface ExtensionQuery {
	    /**
	     * When retrieving extensions with a query; frequently the caller only needs a small subset of the assets. The caller may specify a list of asset types that should be returned if the extension contains it. All other assets will not be returned.
	     */
	    assetTypes: string[];
	    /**
	     * Each filter is a unique query and will have matching set of extensions returned from the request. Each result will have the same index in the resulting array that the filter had in the incoming query.
	     */
	    filters: QueryFilter[];
	    /**
	     * The Flags are used to deterine which set of information the caller would like returned for the matched extensions.
	     */
	    flags: ExtensionQueryFlags;
	}
	export enum ExtensionQueryFilterType {
	    /**
	     * The values are used as tags. All tags are treated as "OR" conditions with each other. There may be some value put on the number of matched tags from the query.
	     */
	    Tag = 1,
	    /**
	     * The Values are an ExtensionName or fragment that is used to match other extension names.
	     */
	    DisplayName = 2,
	    /**
	     * The Filter is one or more tokens that define what scope to return private extensions for.
	     */
	    Private = 3,
	    /**
	     * Retrieve a set of extensions based on their id's. The values should be the extension id's encoded as strings.
	     */
	    Id = 4,
	    /**
	     * The catgeory is unlike other filters. It is AND'd with the other filters instead of being a seperate query.
	     */
	    Category = 5,
	    /**
	     * Certain contribution types may be indexed to allow for query by type. User defined types can't be indexed at the moment.
	     */
	    ContributionType = 6,
	    /**
	     * Retrieve an set extension based on the name based identifier. This differs from the internal id (which is being deprecated).
	     */
	    Name = 7,
	    /**
	     * The InstallationTarget for an extension defines the target consumer for the extension. This may be something like VS, VSOnline, or VSCode
	     */
	    InstallationTarget = 8,
	    /**
	     * Query for featured extensions, no value is allowed when using the query type.
	     */
	    Featured = 9,
	    /**
	     * The SearchText provided by the user to search for extensions
	     */
	    SearchText = 10,
	}
	export enum ExtensionQueryFlags {
	    /**
	     * None is used to retrieve only the basic extension details.
	     */
	    None = 0,
	    /**
	     * IncludeVersions will return version information for extensions returned
	     */
	    IncludeVersions = 1,
	    /**
	     * IncludeFiles will return information about which files were found within the extension that were stored independant of the manifest. When asking for files, versions will be included as well since files are returned as a property of the versions.  These files can be retrieved using the path to the file without requiring the entire manifest be downloaded.
	     */
	    IncludeFiles = 2,
	    /**
	     * Include the Categories and Tags that were added to the extension definition.
	     */
	    IncludeCategoryAndTags = 4,
	    /**
	     * Include the details about which accounts the extension has been shared with if the extesion is a private extension.
	     */
	    IncludeSharedAccounts = 8,
	    /**
	     * Include properties associated with versions of the extension
	     */
	    IncludeVersionProperties = 16,
	    /**
	     * Excluding non-validated extensions will remove any extension versions that either are in the process of being validated or have failed validation.
	     */
	    ExcludeNonValidated = 32,
	    /**
	     * Include the set of installation targets the extension has requested.
	     */
	    IncludeInstallationTargets = 64,
	    /**
	     * Include the base uri for assets of this extension
	     */
	    IncludeAssetUri = 128,
	    /**
	     * Include the statistics associated with this extension
	     */
	    IncludeStatistics = 256,
	    /**
	     * When retrieving versions from a query, only include the latest version of the extensions that matched. This is useful when the caller doesn't need all the published versions. It will save a significant size in the returned payload.
	     */
	    IncludeLatestVersionOnly = 512,
	    /**
	     * AllAttributes is designed to be a mask that defines all sub-elements of the extension should be returned.  NOTE: This is not actually All flags. This is now locked to the set defined since changing this enum would be a breaking change and would change the behavior of anyone using it. Try not to use this value when making calls to the service, instead be explicit about the options required.
	     */
	    AllAttributes = 479,
	}
	/**
	 * This is the set of extensions that matched a supplied query through the filters given.
	 */
	export interface ExtensionQueryResult {
	    /**
	     * For each filter supplied in the query, a filter result will be returned in the query result.
	     */
	    results: ExtensionFilterResult[];
	}
	export interface ExtensionShare {
	    id: string;
	    name: string;
	    type: string;
	}
	export interface ExtensionStatistic {
	    statisticName: string;
	    value: number;
	}
	export enum ExtensionStatisticOperation {
	    None = 0,
	    Set = 1,
	    Increment = 2,
	    Decrement = 3,
	}
	export interface ExtensionVersion {
	    assetUri: string;
	    files: ExtensionFile[];
	    flags: ExtensionVersionFlags;
	    lastUpdated: Date;
	    properties: {
	        key: string;
	        value: string;
	    }[];
	    validationResultMessage: string;
	    version: string;
	    versionDescription: string;
	}
	export enum ExtensionVersionFlags {
	    /**
	     * No flags exist for this version.
	     */
	    None = 0,
	    /**
	     * The Validated flag for a version means the extension version has passed validation and can be used..
	     */
	    Validated = 1,
	}
	/**
	 * One condition in a QueryFilter.
	 */
	export interface FilterCriteria {
	    filterType: number;
	    /**
	     * The value used in the match based on the filter type.
	     */
	    value: string;
	}
	export interface InstallationTarget {
	    target: string;
	}
	/**
	 * MetadataItem is one value of metadata under a given category of metadata
	 */
	export interface MetadataItem {
	    /**
	     * The count of the metadata item
	     */
	    count: number;
	    /**
	     * The name of the metadata item
	     */
	    name: string;
	}
	export enum PagingDirection {
	    /**
	     * Backward will return results from earlier in the resultset.
	     */
	    Backward = 1,
	    /**
	     * Forward will return results from later in the resultset.
	     */
	    Forward = 2,
	}
	export interface PublishedExtension {
	    categories: string[];
	    displayName: string;
	    extensionId: string;
	    extensionName: string;
	    flags: PublishedExtensionFlags;
	    installationTargets: InstallationTarget[];
	    lastUpdated: Date;
	    longDescription: string;
	    publisher: PublisherFacts;
	    sharedWith: ExtensionShare[];
	    shortDescription: string;
	    statistics: ExtensionStatistic[];
	    tags: string[];
	    versions: ExtensionVersion[];
	}
	export enum PublishedExtensionFlags {
	    /**
	     * No flags exist for this extension.
	     */
	    None = 0,
	    /**
	     * The Disabled flag for an extension means the extension can't be changed and won't be used by consumers. The disabled flag is managed by the service and can't be supplied by the Extension Developers.
	     */
	    Disabled = 1,
	    /**
	     * BuiltIn Extension are available to all Tenants. An explicit registration is not required. This attribute is reserved and can't be supplied by Extension Developers.  BuiltIn extensions are by definition Public. There is no need to set the public flag for extensions marked BuiltIn.
	     */
	    BuiltIn = 2,
	    /**
	     * This extension has been validated by the service. The extension meets the requirements specified. This attribute is reserved and can't be supplied by the Extension Developers. Validation is a process that ensures that all contributions are well formed. They meet the requirements defined by the contribution type they are extending. Note this attribute will be updated asynchronously as the extension is validated by the developer of the contribution type. There will be restricted access to the extension while this process is performed.
	     */
	    Validated = 4,
	    /**
	     * Trusted extensions are ones that are given special capabilities. These tend to come from Microsoft and can't be published by the general public.  Note: BuiltIn extensions are always trusted.
	     */
	    Trusted = 8,
	    /**
	     * This extension registration is public, making its visibilty open to the public. This means all tenants have the ability to install this extension. Without this flag the extension will be private and will need to be shared with the tenants that can install it.
	     */
	    Public = 256,
	    /**
	     * This extension has multiple versions active at one time and version discovery should be done usig the defined "Version Discovery" protocol to determine the version available to a specific user or tenant.  @TODO: Link to Version Discovery Protocol.
	     */
	    MultiVersion = 512,
	    /**
	     * The system flag is reserved, and cant be used by publishers.
	     */
	    System = 1024,
	    /**
	     * The Preview flag indicates that the extension is still under preview (not yet of "release" quality). These extensions may be decorated differently in the gallery and may have different policies applied to them.
	     */
	    Preview = 2048,
	}
	export interface Publisher {
	    displayName: string;
	    extensions: PublishedExtension[];
	    flags: PublisherFlags;
	    lastUpdated: Date;
	    longDescription: string;
	    publisherId: string;
	    publisherName: string;
	    shortDescription: string;
	}
	/**
	 * High-level information about the publisher, like id's and names
	 */
	export interface PublisherFacts {
	    displayName: string;
	    flags: PublisherFlags;
	    publisherId: string;
	    publisherName: string;
	}
	/**
	 * The FilterResult is the set of publishers that matched a particular query filter.
	 */
	export interface PublisherFilterResult {
	    /**
	     * This is the set of appplications that matched the query filter supplied.
	     */
	    publishers: Publisher[];
	}
	export enum PublisherFlags {
	    /**
	     * This should never be returned, it is used to represent a publisher who's flags havent changed during update calls.
	     */
	    UnChanged = 1073741824,
	    /**
	     * No flags exist for this publisher.
	     */
	    None = 0,
	    /**
	     * The Disabled flag for a publisher means the publisher can't be changed and won't be used by consumers, this extends to extensions owned by the publisher as well. The disabled flag is managed by the service and can't be supplied by the Extension Developers.
	     */
	    Disabled = 1,
	    /**
	     * A verified publisher is one that Microsoft has done some review of and ensured the publisher meets a set of requirements. The requirements to become a verified publisher are not listed here.  They can be found in public documentation (TBD).
	     */
	    Verified = 2,
	    /**
	     * This is the set of flags that can't be supplied by the developer and is managed by the service itself.
	     */
	    ServiceFlags = 3,
	}
	export enum PublisherPermissions {
	    /**
	     * This gives the bearer the rights to read Publishers and Extensions.
	     */
	    Read = 1,
	    /**
	     * This gives the bearer the rights to update, delete, and share Extensions (but not the ability to create them).
	     */
	    UpdateExtension = 2,
	    /**
	     * This gives the bearer the rights to create new Publishers at the root of the namespace.
	     */
	    CreatePublisher = 4,
	    /**
	     * This gives the bearer the rights to create new Extensions within a publisher.
	     */
	    PublishExtension = 8,
	    /**
	     * Admin gives the bearer the rights to manage restricted attributes of Publishers and Extensions.
	     */
	    Admin = 16,
	    /**
	     * TrustedPartner gives the bearer the rights to publish a extensions with restricted capabilities.
	     */
	    TrustedPartner = 32,
	    /**
	     * PrivateRead is another form of read designed to allow higher privilege accessors the ability to read private extensions.
	     */
	    PrivateRead = 64,
	    /**
	     * This gives the bearer the rights to delete any extension.
	     */
	    DeleteExtension = 128,
	    /**
	     * This gives the bearer the rights edit the publisher settings.
	     */
	    EditSettings = 256,
	    /**
	     * This gives the bearer the rights to see all permissions on the publisher.
	     */
	    ViewPermissions = 512,
	    /**
	     * This gives the bearer the rights to assign permissions on the publisher.
	     */
	    ManagePermissions = 1024,
	    /**
	     * This gives the bearer the rights to delete the publisher.
	     */
	    DeletePublisher = 2048,
	}
	/**
	 * An PublisherQuery is used to search the gallery for a set of publishers that match one of many filter values.
	 */
	export interface PublisherQuery {
	    /**
	     * Each filter is a unique query and will have matching set of publishers returned from the request. Each result will have the same index in the resulting array that the filter had in the incoming query.
	     */
	    filters: QueryFilter[];
	    /**
	     * The Flags are used to deterine which set of information the caller would like returned for the matched publishers.
	     */
	    flags: PublisherQueryFlags;
	}
	export enum PublisherQueryFilterType {
	    /**
	     * The values are used as tags. All tags are treated as "OR" conditions with each other. There may be some value put on the number of matched tags from the query.
	     */
	    Tag = 1,
	    /**
	     * The Values are an PublisherName or fragment that is used to match other extension names.
	     */
	    DisplayName = 2,
	    /**
	     * The My Query filter is used to retrieve the set of publishers that I have access to publish extesions into. All Values are ignored and the calling user is used as the filter in this case.
	     */
	    My = 3,
	}
	export enum PublisherQueryFlags {
	    /**
	     * None is used to retrieve only the basic publisher details.
	     */
	    None = 0,
	    /**
	     * Is used to include a list of basic extension details for all extensions published by the requested publisher.
	     */
	    IncludeExtensions = 1,
	}
	/**
	 * This is the set of publishers that matched a supplied query through the filters given.
	 */
	export interface PublisherQueryResult {
	    /**
	     * For each filter supplied in the query, a filter result will be returned in the query result.
	     */
	    results: PublisherFilterResult[];
	}
	/**
	 * A filter used to define a set of extensions to return during a query.
	 */
	export interface QueryFilter {
	    /**
	     * The filter values define the set of values in this query. They are applied based on the QueryFilterType.
	     */
	    criteria: FilterCriteria[];
	    /**
	     * The PagingDirection is applied to a paging token if one exists. If not the direction is ignored, and Forward from the start of the resultset is used. Direction should be left out of the request unless a paging token is used to help prevent future issues.
	     */
	    direction: PagingDirection;
	    /**
	     * The page number requested by the user. If not provided 1 is assumed by default.
	     */
	    pageNumber: number;
	    /**
	     * The page size defines the number of results the caller wants for this filter. The count can't exceed the overall query size limits.
	     */
	    pageSize: number;
	    /**
	     * The paging token is a distinct type of filter and the other filter fields are ignored. The paging token represents the continuation of a previously executed query. The information about where in the result and what fields are being filtered are embeded in the token.
	     */
	    pagingToken: string;
	    /**
	     * Defines the type of sorting to be applied on the results. The page slice is cut of the sorted results only.
	     */
	    sortBy: number;
	    /**
	     * Defines the order of sorting, 1 for Ascending, 2 for Descending, else default ordering based on the SortBy value
	     */
	    sortOrder: number;
	}
	export interface Review {
	    /**
	     * Unique identifier of a review item
	     */
	    id: number;
	    /**
	     * Flag for soft deletion
	     */
	    isDeleted: boolean;
	    /**
	     * Version of the product for which review was submitted
	     */
	    productVersion: string;
	    /**
	     * Rating procided by the user
	     */
	    rating: number;
	    /**
	     * Text description of the review
	     */
	    text: string;
	    /**
	     * Title of the review
	     */
	    title: string;
	    /**
	     * Time when the review was edited/updated
	     */
	    updatedDate: Date;
	    /**
	     * Id of the user who submitted the review
	     */
	    userId: string;
	}
	export interface ReviewsResult {
	    /**
	     * Flag indicating if there are more reviews to be shown (for paging)
	     */
	    hasMoreReviews: boolean;
	    /**
	     * List of reviews
	     */
	    reviews: Review[];
	    /**
	     * Count of total review items
	     */
	    totalReviewCount: number;
	}
	export enum SigningKeyPermissions {
	    Read = 1,
	    Write = 2,
	}
	export enum SortByType {
	    /**
	     * The results will be sorted by relevance in case search query is given, if no search query resutls will be provided as is
	     */
	    Relevance = 0,
	    /**
	     * The results will be sorted as per Last Updated date of the extensions with recently updated at the top
	     */
	    LastUpdatedDate = 1,
	    /**
	     * Results will be sorted Alphabetically as per the title of the extension
	     */
	    Title = 2,
	    /**
	     * Results will be sorted Alphabetically as per Publisher title
	     */
	    Publisher = 3,
	    /**
	     * Results will be sorted by Install Count
	     */
	    InstallCount = 4,
	}
	export enum SortOrderType {
	    /**
	     * Results will be sorted in the default order as per the sorting type defined. The default varies for each type, e.g. for Relevance, default is Descnding, for Title default is Ascending etc.
	     */
	    Default = 0,
	    /**
	     * The results will be sorted in Ascending order
	     */
	    Ascending = 1,
	    /**
	     * The results will be sorted in Descending order
	     */
	    Descending = 2,
	}
	/**
	 * Represents the extension policy applied to a given user
	 */
	export interface UserExtensionPolicy {
	    /**
	     * User display name that this policy refers to
	     */
	    displayName: string;
	    /**
	     * The extension policy applied to the user
	     */
	    permissions: ExtensionPolicy;
	    /**
	     * User id that this policy refers to
	     */
	    userId: string;
	}
	export interface UserReportedConcern {
	    /**
	     * Category of the concern
	     */
	    category: ConcernCategory;
	    /**
	     * User comment associated with the report
	     */
	    concernText: string;
	    /**
	     * Id of the review which was reported
	     */
	    reviewId: number;
	    /**
	     * Date the report was submitted
	     */
	    submittedDate: Date;
	    /**
	     * Id of the user who reported a review
	     */
	    userId: string;
	}
	export var TypeInfo: {
	    AcquisitionAssignmentType: {
	        enumValues: {
	            "none": number;
	            "me": number;
	            "all": number;
	        };
	    };
	    AcquisitionOperation: {
	        fields: any;
	    };
	    AcquisitionOperationState: {
	        enumValues: {
	            "disallow": number;
	            "allow": number;
	            "completed": number;
	        };
	    };
	    AcquisitionOperationType: {
	        enumValues: {
	            "get": number;
	            "install": number;
	            "buy": number;
	            "try": number;
	            "request": number;
	            "none": number;
	        };
	    };
	    AcquisitionOptions: {
	        fields: any;
	    };
	    ConcernCategory: {
	        enumValues: {
	            "general": number;
	            "abusive": number;
	            "spam": number;
	        };
	    };
	    ExtensionAcquisitionRequest: {
	        fields: any;
	    };
	    ExtensionFile: {
	        fields: any;
	    };
	    ExtensionFilterResult: {
	        fields: any;
	    };
	    ExtensionFilterResultMetadata: {
	        fields: any;
	    };
	    ExtensionIdentifier: {
	        fields: any;
	    };
	    ExtensionPackage: {
	        fields: any;
	    };
	    ExtensionPolicy: {
	        fields: any;
	    };
	    ExtensionPolicyFlags: {
	        enumValues: {
	            "none": number;
	            "private": number;
	            "public": number;
	            "preview": number;
	            "released": number;
	            "firstParty": number;
	            "all": number;
	        };
	    };
	    ExtensionQuery: {
	        fields: any;
	    };
	    ExtensionQueryFilterType: {
	        enumValues: {
	            "tag": number;
	            "displayName": number;
	            "private": number;
	            "id": number;
	            "category": number;
	            "contributionType": number;
	            "name": number;
	            "installationTarget": number;
	            "featured": number;
	            "searchText": number;
	        };
	    };
	    ExtensionQueryFlags: {
	        enumValues: {
	            "none": number;
	            "includeVersions": number;
	            "includeFiles": number;
	            "includeCategoryAndTags": number;
	            "includeSharedAccounts": number;
	            "includeVersionProperties": number;
	            "excludeNonValidated": number;
	            "includeInstallationTargets": number;
	            "includeAssetUri": number;
	            "includeStatistics": number;
	            "includeLatestVersionOnly": number;
	            "allAttributes": number;
	        };
	    };
	    ExtensionQueryResult: {
	        fields: any;
	    };
	    ExtensionShare: {
	        fields: any;
	    };
	    ExtensionStatistic: {
	        fields: any;
	    };
	    ExtensionStatisticOperation: {
	        enumValues: {
	            "none": number;
	            "set": number;
	            "increment": number;
	            "decrement": number;
	        };
	    };
	    ExtensionVersion: {
	        fields: any;
	    };
	    ExtensionVersionFlags: {
	        enumValues: {
	            "none": number;
	            "validated": number;
	        };
	    };
	    FilterCriteria: {
	        fields: any;
	    };
	    InstallationTarget: {
	        fields: any;
	    };
	    MetadataItem: {
	        fields: any;
	    };
	    PagingDirection: {
	        enumValues: {
	            "backward": number;
	            "forward": number;
	        };
	    };
	    PublishedExtension: {
	        fields: any;
	    };
	    PublishedExtensionFlags: {
	        enumValues: {
	            "none": number;
	            "disabled": number;
	            "builtIn": number;
	            "validated": number;
	            "trusted": number;
	            "public": number;
	            "multiVersion": number;
	            "system": number;
	            "preview": number;
	        };
	    };
	    Publisher: {
	        fields: any;
	    };
	    PublisherFacts: {
	        fields: any;
	    };
	    PublisherFilterResult: {
	        fields: any;
	    };
	    PublisherFlags: {
	        enumValues: {
	            "unChanged": number;
	            "none": number;
	            "disabled": number;
	            "verified": number;
	            "serviceFlags": number;
	        };
	    };
	    PublisherPermissions: {
	        enumValues: {
	            "read": number;
	            "updateExtension": number;
	            "createPublisher": number;
	            "publishExtension": number;
	            "admin": number;
	            "trustedPartner": number;
	            "privateRead": number;
	            "deleteExtension": number;
	            "editSettings": number;
	            "viewPermissions": number;
	            "managePermissions": number;
	            "deletePublisher": number;
	        };
	    };
	    PublisherQuery: {
	        fields: any;
	    };
	    PublisherQueryFilterType: {
	        enumValues: {
	            "tag": number;
	            "displayName": number;
	            "my": number;
	        };
	    };
	    PublisherQueryFlags: {
	        enumValues: {
	            "none": number;
	            "includeExtensions": number;
	        };
	    };
	    PublisherQueryResult: {
	        fields: any;
	    };
	    QueryFilter: {
	        fields: any;
	    };
	    Review: {
	        fields: any;
	    };
	    ReviewsResult: {
	        fields: any;
	    };
	    SigningKeyPermissions: {
	        enumValues: {
	            "read": number;
	            "write": number;
	        };
	    };
	    SortByType: {
	        enumValues: {
	            "relevance": number;
	            "lastUpdatedDate": number;
	            "title": number;
	            "publisher": number;
	            "installCount": number;
	        };
	    };
	    SortOrderType: {
	        enumValues: {
	            "default": number;
	            "ascending": number;
	            "descending": number;
	        };
	    };
	    UserExtensionPolicy: {
	        fields: any;
	    };
	    UserReportedConcern: {
	        fields: any;
	    };
	};

}
declare module 'vso-node-api/GalleryApi' {
	/// <reference path="../node/node.d.ts" />
	/// <reference path="../q/Q.d.ts" />
	import Q = require('q');
	import basem = require('vso-node-api/ClientApiBases');
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	import GalleryInterfaces = require('vso-node-api/interfaces/GalleryInterfaces');
	export interface IGalleryApi extends basem.ClientApiBase {
	    shareExtensionById(extensionId: string, accountName: string, onResult: (err: any, statusCode: number) => void): void;
	    unshareExtensionById(extensionId: string, accountName: string, onResult: (err: any, statusCode: number) => void): void;
	    shareExtension(publisherName: string, extensionName: string, accountName: string, onResult: (err: any, statusCode: number) => void): void;
	    unshareExtension(publisherName: string, extensionName: string, accountName: string, onResult: (err: any, statusCode: number) => void): void;
	    getAcquisitionOptions(itemId: string, installationTarget: string, onResult: (err: any, statusCode: number, acquisitionoption: GalleryInterfaces.AcquisitionOptions) => void): void;
	    requestAcquisition(acquisitionRequest: GalleryInterfaces.ExtensionAcquisitionRequest, onResult: (err: any, statusCode: number, acquisitionrequest: GalleryInterfaces.ExtensionAcquisitionRequest) => void): void;
	    getAssetByName(publisherName: string, extensionName: string, version: string, assetType: string, accountToken: string, acceptDefault: boolean, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getAsset(extensionId: string, version: string, assetType: string, accountToken: string, acceptDefault: boolean, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getCategories(languages: string, onResult: (err: any, statusCode: number, categories: string[]) => void): void;
	    getCertificate(publisherName: string, extensionName: string, version: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    queryExtensions(extensionQuery: GalleryInterfaces.ExtensionQuery, accountToken: string, onResult: (err: any, statusCode: number, extensionquery: GalleryInterfaces.ExtensionQueryResult) => void): void;
	    createExtension(extensionPackage: GalleryInterfaces.ExtensionPackage, onResult: (err: any, statusCode: number, extension: GalleryInterfaces.PublishedExtension) => void): void;
	    deleteExtensionById(extensionId: string, version: string, onResult: (err: any, statusCode: number) => void): void;
	    getExtensionById(extensionId: string, version: string, flags: GalleryInterfaces.ExtensionQueryFlags, onResult: (err: any, statusCode: number, extension: GalleryInterfaces.PublishedExtension) => void): void;
	    updateExtensionById(extensionPackage: GalleryInterfaces.ExtensionPackage, extensionId: string, onResult: (err: any, statusCode: number, extension: GalleryInterfaces.PublishedExtension) => void): void;
	    createExtensionWithPublisher(extensionPackage: GalleryInterfaces.ExtensionPackage, publisherName: string, onResult: (err: any, statusCode: number, extension: GalleryInterfaces.PublishedExtension) => void): void;
	    deleteExtension(publisherName: string, extensionName: string, version: string, onResult: (err: any, statusCode: number) => void): void;
	    getExtension(publisherName: string, extensionName: string, version: string, flags: GalleryInterfaces.ExtensionQueryFlags, accountToken: string, onResult: (err: any, statusCode: number, extension: GalleryInterfaces.PublishedExtension) => void): void;
	    updateExtension(extensionPackage: GalleryInterfaces.ExtensionPackage, publisherName: string, extensionName: string, onResult: (err: any, statusCode: number, extension: GalleryInterfaces.PublishedExtension) => void): void;
	    getPackage(publisherName: string, extensionName: string, version: string, accountToken: string, acceptDefault: boolean, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getAssetWithToken(publisherName: string, extensionName: string, version: string, assetType: string, assetToken: string, accountToken: string, acceptDefault: boolean, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    queryPublishers(publisherQuery: GalleryInterfaces.PublisherQuery, onResult: (err: any, statusCode: number, publisherquery: GalleryInterfaces.PublisherQueryResult) => void): void;
	    createPublisher(publisher: GalleryInterfaces.Publisher, onResult: (err: any, statusCode: number, publisher: GalleryInterfaces.Publisher) => void): void;
	    deletePublisher(publisherName: string, onResult: (err: any, statusCode: number) => void): void;
	    getPublisher(publisherName: string, flags: number, onResult: (err: any, statusCode: number, publisher: GalleryInterfaces.Publisher) => void): void;
	    updatePublisher(publisher: GalleryInterfaces.Publisher, publisherName: string, onResult: (err: any, statusCode: number, publisher: GalleryInterfaces.Publisher) => void): void;
	    createReview(review: GalleryInterfaces.Review, extensionId: string, onResult: (err: any, statusCode: number, review: GalleryInterfaces.Review) => void): void;
	    getReviews(extensionId: string, onResult: (err: any, statusCode: number, review: GalleryInterfaces.ReviewsResult) => void): void;
	    generateKey(keyType: string, expireCurrentSeconds: number, onResult: (err: any, statusCode: number) => void): void;
	    getSigningKey(keyType: string, onResult: (err: any, statusCode: number, signingkey: string) => void): void;
	}
	export interface IQGalleryApi extends basem.QClientApiBase {
	    shareExtensionById(extensionId: string, accountName: string): Q.Promise<void>;
	    unshareExtensionById(extensionId: string, accountName: string): Q.Promise<void>;
	    shareExtension(publisherName: string, extensionName: string, accountName: string): Q.Promise<void>;
	    unshareExtension(publisherName: string, extensionName: string, accountName: string): Q.Promise<void>;
	    getAcquisitionOptions(itemId: string, installationTarget: string): Q.Promise<GalleryInterfaces.AcquisitionOptions>;
	    requestAcquisition(acquisitionRequest: GalleryInterfaces.ExtensionAcquisitionRequest): Q.Promise<GalleryInterfaces.ExtensionAcquisitionRequest>;
	    getAssetByName(publisherName: string, extensionName: string, version: string, assetType: string, accountToken?: string, acceptDefault?: boolean): Q.Promise<NodeJS.ReadableStream>;
	    getAsset(extensionId: string, version: string, assetType: string, accountToken?: string, acceptDefault?: boolean): Q.Promise<NodeJS.ReadableStream>;
	    getCategories(languages?: string): Q.Promise<string[]>;
	    getCertificate(publisherName: string, extensionName: string, version?: string): Q.Promise<NodeJS.ReadableStream>;
	    queryExtensions(extensionQuery: GalleryInterfaces.ExtensionQuery, accountToken?: string): Q.Promise<GalleryInterfaces.ExtensionQueryResult>;
	    createExtension(extensionPackage: GalleryInterfaces.ExtensionPackage): Q.Promise<GalleryInterfaces.PublishedExtension>;
	    deleteExtensionById(extensionId: string, version?: string): Q.Promise<void>;
	    getExtensionById(extensionId: string, version?: string, flags?: GalleryInterfaces.ExtensionQueryFlags): Q.Promise<GalleryInterfaces.PublishedExtension>;
	    updateExtensionById(extensionPackage: GalleryInterfaces.ExtensionPackage, extensionId: string): Q.Promise<GalleryInterfaces.PublishedExtension>;
	    createExtensionWithPublisher(extensionPackage: GalleryInterfaces.ExtensionPackage, publisherName: string): Q.Promise<GalleryInterfaces.PublishedExtension>;
	    deleteExtension(publisherName: string, extensionName: string, version?: string): Q.Promise<void>;
	    getExtension(publisherName: string, extensionName: string, version?: string, flags?: GalleryInterfaces.ExtensionQueryFlags, accountToken?: string): Q.Promise<GalleryInterfaces.PublishedExtension>;
	    updateExtension(extensionPackage: GalleryInterfaces.ExtensionPackage, publisherName: string, extensionName: string): Q.Promise<GalleryInterfaces.PublishedExtension>;
	    getPackage(publisherName: string, extensionName: string, version: string, accountToken?: string, acceptDefault?: boolean): Q.Promise<NodeJS.ReadableStream>;
	    getAssetWithToken(publisherName: string, extensionName: string, version: string, assetType: string, assetToken?: string, accountToken?: string, acceptDefault?: boolean): Q.Promise<NodeJS.ReadableStream>;
	    queryPublishers(publisherQuery: GalleryInterfaces.PublisherQuery): Q.Promise<GalleryInterfaces.PublisherQueryResult>;
	    createPublisher(publisher: GalleryInterfaces.Publisher): Q.Promise<GalleryInterfaces.Publisher>;
	    deletePublisher(publisherName: string): Q.Promise<void>;
	    getPublisher(publisherName: string, flags?: number): Q.Promise<GalleryInterfaces.Publisher>;
	    updatePublisher(publisher: GalleryInterfaces.Publisher, publisherName: string): Q.Promise<GalleryInterfaces.Publisher>;
	    createReview(review: GalleryInterfaces.Review, extensionId: string): Q.Promise<GalleryInterfaces.Review>;
	    getReviews(extensionId: string): Q.Promise<GalleryInterfaces.ReviewsResult>;
	    generateKey(keyType: string, expireCurrentSeconds?: number): Q.Promise<void>;
	    getSigningKey(keyType: string): Q.Promise<string>;
	}
	export class GalleryApi extends basem.ClientApiBase implements IGalleryApi {
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	     * @param {string} extensionId
	     * @param {string} accountName
	     * @param onResult callback function
	     */
	    shareExtensionById(extensionId: string, accountName: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} extensionId
	     * @param {string} accountName
	     * @param onResult callback function
	     */
	    unshareExtensionById(extensionId: string, accountName: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} publisherName
	     * @param {string} extensionName
	     * @param {string} accountName
	     * @param onResult callback function
	     */
	    shareExtension(publisherName: string, extensionName: string, accountName: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} publisherName
	     * @param {string} extensionName
	     * @param {string} accountName
	     * @param onResult callback function
	     */
	    unshareExtension(publisherName: string, extensionName: string, accountName: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} itemId
	     * @param {string} installationTarget
	     * @param onResult callback function with the resulting GalleryInterfaces.AcquisitionOptions
	     */
	    getAcquisitionOptions(itemId: string, installationTarget: string, onResult: (err: any, statusCode: number, acquisitionoption: GalleryInterfaces.AcquisitionOptions) => void): void;
	    /**
	     * @param {GalleryInterfaces.ExtensionAcquisitionRequest} acquisitionRequest
	     * @param onResult callback function with the resulting GalleryInterfaces.ExtensionAcquisitionRequest
	     */
	    requestAcquisition(acquisitionRequest: GalleryInterfaces.ExtensionAcquisitionRequest, onResult: (err: any, statusCode: number, acquisitionrequest: GalleryInterfaces.ExtensionAcquisitionRequest) => void): void;
	    /**
	     * @param {string} publisherName
	     * @param {string} extensionName
	     * @param {string} version
	     * @param {string} assetType
	     * @param {string} accountToken
	     * @param {boolean} acceptDefault
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getAssetByName(publisherName: string, extensionName: string, version: string, assetType: string, accountToken: string, acceptDefault: boolean, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {string} extensionId
	     * @param {string} version
	     * @param {string} assetType
	     * @param {string} accountToken
	     * @param {boolean} acceptDefault
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getAsset(extensionId: string, version: string, assetType: string, accountToken: string, acceptDefault: boolean, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {string} languages
	     * @param onResult callback function with the resulting string[]
	     */
	    getCategories(languages: string, onResult: (err: any, statusCode: number, categories: string[]) => void): void;
	    /**
	     * @param {string} publisherName
	     * @param {string} extensionName
	     * @param {string} version
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getCertificate(publisherName: string, extensionName: string, version: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {GalleryInterfaces.ExtensionQuery} extensionQuery
	     * @param {string} accountToken
	     * @param onResult callback function with the resulting GalleryInterfaces.ExtensionQueryResult
	     */
	    queryExtensions(extensionQuery: GalleryInterfaces.ExtensionQuery, accountToken: string, onResult: (err: any, statusCode: number, extensionquery: GalleryInterfaces.ExtensionQueryResult) => void): void;
	    /**
	     * @param {GalleryInterfaces.ExtensionPackage} extensionPackage
	     * @param onResult callback function with the resulting GalleryInterfaces.PublishedExtension
	     */
	    createExtension(extensionPackage: GalleryInterfaces.ExtensionPackage, onResult: (err: any, statusCode: number, extension: GalleryInterfaces.PublishedExtension) => void): void;
	    /**
	     * @param {string} extensionId
	     * @param {string} version
	     * @param onResult callback function
	     */
	    deleteExtensionById(extensionId: string, version: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} extensionId
	     * @param {string} version
	     * @param {GalleryInterfaces.ExtensionQueryFlags} flags
	     * @param onResult callback function with the resulting GalleryInterfaces.PublishedExtension
	     */
	    getExtensionById(extensionId: string, version: string, flags: GalleryInterfaces.ExtensionQueryFlags, onResult: (err: any, statusCode: number, extension: GalleryInterfaces.PublishedExtension) => void): void;
	    /**
	     * @param {GalleryInterfaces.ExtensionPackage} extensionPackage
	     * @param {string} extensionId
	     * @param onResult callback function with the resulting GalleryInterfaces.PublishedExtension
	     */
	    updateExtensionById(extensionPackage: GalleryInterfaces.ExtensionPackage, extensionId: string, onResult: (err: any, statusCode: number, extension: GalleryInterfaces.PublishedExtension) => void): void;
	    /**
	     * @param {GalleryInterfaces.ExtensionPackage} extensionPackage
	     * @param {string} publisherName
	     * @param onResult callback function with the resulting GalleryInterfaces.PublishedExtension
	     */
	    createExtensionWithPublisher(extensionPackage: GalleryInterfaces.ExtensionPackage, publisherName: string, onResult: (err: any, statusCode: number, extension: GalleryInterfaces.PublishedExtension) => void): void;
	    /**
	     * @param {string} publisherName
	     * @param {string} extensionName
	     * @param {string} version
	     * @param onResult callback function
	     */
	    deleteExtension(publisherName: string, extensionName: string, version: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} publisherName
	     * @param {string} extensionName
	     * @param {string} version
	     * @param {GalleryInterfaces.ExtensionQueryFlags} flags
	     * @param {string} accountToken
	     * @param onResult callback function with the resulting GalleryInterfaces.PublishedExtension
	     */
	    getExtension(publisherName: string, extensionName: string, version: string, flags: GalleryInterfaces.ExtensionQueryFlags, accountToken: string, onResult: (err: any, statusCode: number, extension: GalleryInterfaces.PublishedExtension) => void): void;
	    /**
	     * @param {GalleryInterfaces.ExtensionPackage} extensionPackage
	     * @param {string} publisherName
	     * @param {string} extensionName
	     * @param onResult callback function with the resulting GalleryInterfaces.PublishedExtension
	     */
	    updateExtension(extensionPackage: GalleryInterfaces.ExtensionPackage, publisherName: string, extensionName: string, onResult: (err: any, statusCode: number, extension: GalleryInterfaces.PublishedExtension) => void): void;
	    /**
	     * @param {string} publisherName
	     * @param {string} extensionName
	     * @param {string} version
	     * @param {string} accountToken
	     * @param {boolean} acceptDefault
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getPackage(publisherName: string, extensionName: string, version: string, accountToken: string, acceptDefault: boolean, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {string} publisherName
	     * @param {string} extensionName
	     * @param {string} version
	     * @param {string} assetType
	     * @param {string} assetToken
	     * @param {string} accountToken
	     * @param {boolean} acceptDefault
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getAssetWithToken(publisherName: string, extensionName: string, version: string, assetType: string, assetToken: string, accountToken: string, acceptDefault: boolean, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {GalleryInterfaces.PublisherQuery} publisherQuery
	     * @param onResult callback function with the resulting GalleryInterfaces.PublisherQueryResult
	     */
	    queryPublishers(publisherQuery: GalleryInterfaces.PublisherQuery, onResult: (err: any, statusCode: number, publisherquery: GalleryInterfaces.PublisherQueryResult) => void): void;
	    /**
	     * @param {GalleryInterfaces.Publisher} publisher
	     * @param onResult callback function with the resulting GalleryInterfaces.Publisher
	     */
	    createPublisher(publisher: GalleryInterfaces.Publisher, onResult: (err: any, statusCode: number, publisher: GalleryInterfaces.Publisher) => void): void;
	    /**
	     * @param {string} publisherName
	     * @param onResult callback function
	     */
	    deletePublisher(publisherName: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} publisherName
	     * @param {number} flags
	     * @param onResult callback function with the resulting GalleryInterfaces.Publisher
	     */
	    getPublisher(publisherName: string, flags: number, onResult: (err: any, statusCode: number, publisher: GalleryInterfaces.Publisher) => void): void;
	    /**
	     * @param {GalleryInterfaces.Publisher} publisher
	     * @param {string} publisherName
	     * @param onResult callback function with the resulting GalleryInterfaces.Publisher
	     */
	    updatePublisher(publisher: GalleryInterfaces.Publisher, publisherName: string, onResult: (err: any, statusCode: number, publisher: GalleryInterfaces.Publisher) => void): void;
	    /**
	     * Creates a new review item
	     *
	     * @param {GalleryInterfaces.Review} review - Contains details about the review item to be created like rating, reviewText, productId
	     * @param {string} extensionId
	     * @param onResult callback function with the resulting GalleryInterfaces.Review
	     */
	    createReview(review: GalleryInterfaces.Review, extensionId: string, onResult: (err: any, statusCode: number, review: GalleryInterfaces.Review) => void): void;
	    /**
	     * Returns all reviews associated with a product
	     *
	     * @param {string} extensionId - Guid of the extension whose reviews need to be retrieved
	     * @param onResult callback function with the resulting GalleryInterfaces.ReviewsResult
	     */
	    getReviews(extensionId: string, onResult: (err: any, statusCode: number, review: GalleryInterfaces.ReviewsResult) => void): void;
	    /**
	     * @param {string} keyType
	     * @param {number} expireCurrentSeconds
	     * @param onResult callback function
	     */
	    generateKey(keyType: string, expireCurrentSeconds: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} keyType
	     * @param onResult callback function with the resulting string
	     */
	    getSigningKey(keyType: string, onResult: (err: any, statusCode: number, signingkey: string) => void): void;
	}
	export class QGalleryApi extends basem.QClientApiBase implements IQGalleryApi {
	    api: GalleryApi;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	    * @param {string} extensionId
	    * @param {string} accountName
	    */
	    shareExtensionById(extensionId: string, accountName: string): Q.Promise<void>;
	    /**
	    * @param {string} extensionId
	    * @param {string} accountName
	    */
	    unshareExtensionById(extensionId: string, accountName: string): Q.Promise<void>;
	    /**
	    * @param {string} publisherName
	    * @param {string} extensionName
	    * @param {string} accountName
	    */
	    shareExtension(publisherName: string, extensionName: string, accountName: string): Q.Promise<void>;
	    /**
	    * @param {string} publisherName
	    * @param {string} extensionName
	    * @param {string} accountName
	    */
	    unshareExtension(publisherName: string, extensionName: string, accountName: string): Q.Promise<void>;
	    /**
	    * @param {string} itemId
	    * @param {string} installationTarget
	    */
	    getAcquisitionOptions(itemId: string, installationTarget: string): Q.Promise<GalleryInterfaces.AcquisitionOptions>;
	    /**
	    * @param {GalleryInterfaces.ExtensionAcquisitionRequest} acquisitionRequest
	    */
	    requestAcquisition(acquisitionRequest: GalleryInterfaces.ExtensionAcquisitionRequest): Q.Promise<GalleryInterfaces.ExtensionAcquisitionRequest>;
	    /**
	    * @param {string} publisherName
	    * @param {string} extensionName
	    * @param {string} version
	    * @param {string} assetType
	    * @param {string} accountToken
	    * @param {boolean} acceptDefault
	    */
	    getAssetByName(publisherName: string, extensionName: string, version: string, assetType: string, accountToken?: string, acceptDefault?: boolean): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {string} extensionId
	    * @param {string} version
	    * @param {string} assetType
	    * @param {string} accountToken
	    * @param {boolean} acceptDefault
	    */
	    getAsset(extensionId: string, version: string, assetType: string, accountToken?: string, acceptDefault?: boolean): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {string} languages
	    */
	    getCategories(languages?: string): Q.Promise<string[]>;
	    /**
	    * @param {string} publisherName
	    * @param {string} extensionName
	    * @param {string} version
	    */
	    getCertificate(publisherName: string, extensionName: string, version?: string): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {GalleryInterfaces.ExtensionQuery} extensionQuery
	    * @param {string} accountToken
	    */
	    queryExtensions(extensionQuery: GalleryInterfaces.ExtensionQuery, accountToken?: string): Q.Promise<GalleryInterfaces.ExtensionQueryResult>;
	    /**
	    * @param {GalleryInterfaces.ExtensionPackage} extensionPackage
	    */
	    createExtension(extensionPackage: GalleryInterfaces.ExtensionPackage): Q.Promise<GalleryInterfaces.PublishedExtension>;
	    /**
	    * @param {string} extensionId
	    * @param {string} version
	    */
	    deleteExtensionById(extensionId: string, version?: string): Q.Promise<void>;
	    /**
	    * @param {string} extensionId
	    * @param {string} version
	    * @param {GalleryInterfaces.ExtensionQueryFlags} flags
	    */
	    getExtensionById(extensionId: string, version?: string, flags?: GalleryInterfaces.ExtensionQueryFlags): Q.Promise<GalleryInterfaces.PublishedExtension>;
	    /**
	    * @param {GalleryInterfaces.ExtensionPackage} extensionPackage
	    * @param {string} extensionId
	    */
	    updateExtensionById(extensionPackage: GalleryInterfaces.ExtensionPackage, extensionId: string): Q.Promise<GalleryInterfaces.PublishedExtension>;
	    /**
	    * @param {GalleryInterfaces.ExtensionPackage} extensionPackage
	    * @param {string} publisherName
	    */
	    createExtensionWithPublisher(extensionPackage: GalleryInterfaces.ExtensionPackage, publisherName: string): Q.Promise<GalleryInterfaces.PublishedExtension>;
	    /**
	    * @param {string} publisherName
	    * @param {string} extensionName
	    * @param {string} version
	    */
	    deleteExtension(publisherName: string, extensionName: string, version?: string): Q.Promise<void>;
	    /**
	    * @param {string} publisherName
	    * @param {string} extensionName
	    * @param {string} version
	    * @param {GalleryInterfaces.ExtensionQueryFlags} flags
	    * @param {string} accountToken
	    */
	    getExtension(publisherName: string, extensionName: string, version?: string, flags?: GalleryInterfaces.ExtensionQueryFlags, accountToken?: string): Q.Promise<GalleryInterfaces.PublishedExtension>;
	    /**
	    * @param {GalleryInterfaces.ExtensionPackage} extensionPackage
	    * @param {string} publisherName
	    * @param {string} extensionName
	    */
	    updateExtension(extensionPackage: GalleryInterfaces.ExtensionPackage, publisherName: string, extensionName: string): Q.Promise<GalleryInterfaces.PublishedExtension>;
	    /**
	    * @param {string} publisherName
	    * @param {string} extensionName
	    * @param {string} version
	    * @param {string} accountToken
	    * @param {boolean} acceptDefault
	    */
	    getPackage(publisherName: string, extensionName: string, version: string, accountToken?: string, acceptDefault?: boolean): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {string} publisherName
	    * @param {string} extensionName
	    * @param {string} version
	    * @param {string} assetType
	    * @param {string} assetToken
	    * @param {string} accountToken
	    * @param {boolean} acceptDefault
	    */
	    getAssetWithToken(publisherName: string, extensionName: string, version: string, assetType: string, assetToken?: string, accountToken?: string, acceptDefault?: boolean): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {GalleryInterfaces.PublisherQuery} publisherQuery
	    */
	    queryPublishers(publisherQuery: GalleryInterfaces.PublisherQuery): Q.Promise<GalleryInterfaces.PublisherQueryResult>;
	    /**
	    * @param {GalleryInterfaces.Publisher} publisher
	    */
	    createPublisher(publisher: GalleryInterfaces.Publisher): Q.Promise<GalleryInterfaces.Publisher>;
	    /**
	    * @param {string} publisherName
	    */
	    deletePublisher(publisherName: string): Q.Promise<void>;
	    /**
	    * @param {string} publisherName
	    * @param {number} flags
	    */
	    getPublisher(publisherName: string, flags?: number): Q.Promise<GalleryInterfaces.Publisher>;
	    /**
	    * @param {GalleryInterfaces.Publisher} publisher
	    * @param {string} publisherName
	    */
	    updatePublisher(publisher: GalleryInterfaces.Publisher, publisherName: string): Q.Promise<GalleryInterfaces.Publisher>;
	    /**
	    * Creates a new review item
	    *
	    * @param {GalleryInterfaces.Review} review - Contains details about the review item to be created like rating, reviewText, productId
	    * @param {string} extensionId
	    */
	    createReview(review: GalleryInterfaces.Review, extensionId: string): Q.Promise<GalleryInterfaces.Review>;
	    /**
	    * Returns all reviews associated with a product
	    *
	    * @param {string} extensionId - Guid of the extension whose reviews need to be retrieved
	    */
	    getReviews(extensionId: string): Q.Promise<GalleryInterfaces.ReviewsResult>;
	    /**
	    * @param {string} keyType
	    * @param {number} expireCurrentSeconds
	    */
	    generateKey(keyType: string, expireCurrentSeconds?: number): Q.Promise<void>;
	    /**
	    * @param {string} keyType
	    */
	    getSigningKey(keyType: string): Q.Promise<string>;
	}

}
declare module 'vso-node-api/interfaces/GitInterfaces' {
	import TfsCoreInterfaces = require('vso-node-api/interfaces/CoreInterfaces');
	import VSSInterfaces = require('vso-node-api/interfaces/common/VSSInterfaces');
	export interface AssociatedWorkItem {
	    assignedTo: string;
	    id: number;
	    state: string;
	    title: string;
	    /**
	     * REST url
	     */
	    url: string;
	    webUrl: string;
	    workItemType: string;
	}
	export interface Change<T> {
	    changeType: VersionControlChangeType;
	    item: T;
	    newContent: ItemContent;
	    sourceServerItem: string;
	    url: string;
	}
	export interface ChangeCountDictionary {
	}
	export interface ChangeList<T> {
	    allChangesIncluded: boolean;
	    changeCounts: {
	        [key: number]: number;
	    };
	    changes: Change<T>[];
	    comment: string;
	    commentTruncated: boolean;
	    creationDate: Date;
	    notes: CheckinNote[];
	    owner: string;
	    ownerDisplayName: string;
	    ownerId: string;
	    sortDate: Date;
	    version: string;
	}
	/**
	 * Criteria used in a search for change lists
	 */
	export interface ChangeListSearchCriteria {
	    /**
	     * If provided, a version descriptor to compare against base
	     */
	    compareVersion: string;
	    /**
	     * If true, don't include delete history entries
	     */
	    excludeDeletes: boolean;
	    /**
	     * Whether or not to follow renames for the given item being queried
	     */
	    followRenames: boolean;
	    /**
	     * If provided, only include history entries created after this date (string)
	     */
	    fromDate: string;
	    /**
	     * If provided, a version descriptor for the earliest change list to include
	     */
	    fromVersion: string;
	    /**
	     * Path of item to search under
	     */
	    itemPath: string;
	    /**
	     * Version of the items to search
	     */
	    itemVersion: string;
	    /**
	     * Number of results to skip (used when clicking more...)
	     */
	    skip: number;
	    /**
	     * If provided, only include history entries created before this date (string)
	     */
	    toDate: string;
	    /**
	     * If provided, the maximum number of history entries to return
	     */
	    top: number;
	    /**
	     * If provided, a version descriptor for the latest change list to include
	     */
	    toVersion: string;
	    /**
	     * Alias or display name of user who made the changes
	     */
	    user: string;
	}
	export interface CheckinNote {
	    name: string;
	    value: string;
	}
	export interface FileContentMetadata {
	    contentType: string;
	    encoding: number;
	    extension: string;
	    fileName: string;
	    isBinary: boolean;
	    isImage: boolean;
	    vsLink: string;
	}
	export interface GitBaseVersionDescriptor extends GitVersionDescriptor {
	    /**
	     * Version string identifier (name of tag/branch, SHA1 of commit)
	     */
	    baseVersion: string;
	    /**
	     * Version options - Specify additional modifiers to version (e.g Previous)
	     */
	    baseVersionOptions: GitVersionOptions;
	    /**
	     * Version type (branch, tag, or commit). Determines how Id is interpreted
	     */
	    baseVersionType: GitVersionType;
	}
	export interface GitBlobRef {
	    _links: any;
	    /**
	     * SHA1 hash of git object
	     */
	    objectId: string;
	    /**
	     * Size of blob content (in bytes)
	     */
	    size: number;
	    url: string;
	}
	export interface GitBranchStats {
	    aheadCount: number;
	    behindCount: number;
	    commit: GitCommitRef;
	    isBaseVersion: boolean;
	    name: string;
	}
	export interface GitChange extends Change<GitItem> {
	}
	export interface GitCommit extends GitCommitRef {
	    push: GitPushRef;
	    treeId: string;
	}
	export interface GitCommitChanges {
	    changeCounts: ChangeCountDictionary;
	    changes: GitChange[];
	}
	export interface GitCommitDiffs {
	    aheadCount: number;
	    allChangesIncluded: boolean;
	    baseCommit: string;
	    behindCount: number;
	    changeCounts: {
	        [key: number]: number;
	    };
	    changes: GitChange[];
	    commonCommit: string;
	    targetCommit: string;
	}
	export interface GitCommitRef {
	    _links: any;
	    author: GitUserDate;
	    changeCounts: ChangeCountDictionary;
	    changes: GitChange[];
	    comment: string;
	    commentTruncated: boolean;
	    commitId: string;
	    committer: GitUserDate;
	    parents: string[];
	    remoteUrl: string;
	    url: string;
	}
	export interface GitCommitToCreate {
	    baseRef: GitRef;
	    comment: string;
	    pathActions: GitPathAction[];
	}
	export interface GitDeletedRepository {
	    createdDate: Date;
	    deletedBy: VSSInterfaces.IdentityRef;
	    deletedDate: Date;
	    id: string;
	    name: string;
	    project: TfsCoreInterfaces.TeamProjectReference;
	}
	export interface GitHistoryQueryResults extends HistoryQueryResults<GitItem> {
	    /**
	     * Seed commit used for querying history.  Used for skip feature.
	     */
	    startingCommitId: string;
	    unpopulatedCount: number;
	    unprocessedCount: number;
	}
	export interface GitItem extends ItemModel {
	    /**
	     * SHA1 of commit item was fetched at
	     */
	    commitId: string;
	    /**
	     * Type of object (Commit, Tree, Blob, Tag, ...)
	     */
	    gitObjectType: GitObjectType;
	    /**
	     * Shallow ref to commit that last changed this item Only populated if latestProcessedChange is requested May not be accurate if latest change is not yet cached
	     */
	    latestProcessedChange: GitCommitRef;
	    /**
	     * Git object id
	     */
	    objectId: string;
	    /**
	     * Git object id
	     */
	    originalObjectId: string;
	}
	export interface GitItemDescriptor {
	    /**
	     * Path to item
	     */
	    path: string;
	    /**
	     * Specifies whether to include children (OneLevel), all descendants (Full), or None
	     */
	    recursionLevel: VersionControlRecursionType;
	    /**
	     * Version string (interpretation based on VersionType defined in subclass
	     */
	    version: string;
	    /**
	     * Version modifiers (e.g. previous)
	     */
	    versionOptions: GitVersionOptions;
	    /**
	     * How to interpret version (branch,tag,commit)
	     */
	    versionType: GitVersionType;
	}
	export interface GitItemRequestData {
	    /**
	     * Whether to include metadata for all items
	     */
	    includeContentMetadata: boolean;
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    /**
	     * Collection of items to fetch, including path, version, and recursion level
	     */
	    itemDescriptors: GitItemDescriptor[];
	    /**
	     * Whether to include shallow ref to commit that last changed each item
	     */
	    latestProcessedChange: boolean;
	}
	export enum GitObjectType {
	    Bad = 0,
	    Commit = 1,
	    Tree = 2,
	    Blob = 3,
	    Tag = 4,
	    Ext2 = 5,
	    OfsDelta = 6,
	    RefDelta = 7,
	}
	export interface GitPathAction {
	    action: GitPathActions;
	    base64Content: string;
	    path: string;
	    rawTextContent: string;
	    targetPath: string;
	}
	export enum GitPathActions {
	    None = 0,
	    Edit = 1,
	    Delete = 2,
	    Add = 3,
	    Rename = 4,
	}
	export enum GitPermissionScope {
	    Project = 0,
	    Repository = 1,
	    Branch = 2,
	}
	export interface GitPullRequest {
	    _links: any;
	    closedDate: Date;
	    codeReviewId: number;
	    commits: GitCommitRef[];
	    completionOptions: GitPullRequestCompletionOptions;
	    completionQueueTime: Date;
	    createdBy: VSSInterfaces.IdentityRef;
	    creationDate: Date;
	    description: string;
	    lastMergeCommit: GitCommitRef;
	    lastMergeSourceCommit: GitCommitRef;
	    lastMergeTargetCommit: GitCommitRef;
	    mergeId: string;
	    mergeStatus: PullRequestAsyncStatus;
	    pullRequestId: number;
	    remoteUrl: string;
	    repository: GitRepository;
	    reviewers: IdentityRefWithVote[];
	    sourceRefName: string;
	    status: PullRequestStatus;
	    targetRefName: string;
	    title: string;
	    upgraded: boolean;
	    url: string;
	    workItemRefs: VSSInterfaces.ResourceRef[];
	}
	export interface GitPullRequestCompletionOptions {
	    deleteSourceBranch: boolean;
	    mergeCommitMessage: string;
	    squashMerge: boolean;
	}
	export interface GitPullRequestSearchCriteria {
	    creatorId: string;
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    repositoryId: string;
	    reviewerId: string;
	    sourceRefName: string;
	    status: PullRequestStatus;
	    targetRefName: string;
	}
	export interface GitPush extends GitPushRef {
	    commits: GitCommitRef[];
	    refUpdates: GitRefUpdate[];
	    repository: GitRepository;
	}
	export interface GitPushEventData {
	    afterId: string;
	    beforeId: string;
	    branch: string;
	    commits: GitCommit[];
	    repository: GitRepository;
	}
	export interface GitPushRef {
	    _links: any;
	    date: Date;
	    pushCorrelationId: string;
	    pushedBy: VSSInterfaces.IdentityRef;
	    pushId: number;
	    url: string;
	}
	export interface GitPushSearchCriteria {
	    fromDate: Date;
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    includeRefUpdates: boolean;
	    pusherId: string;
	    refName: string;
	    toDate: Date;
	}
	export interface GitQueryCommitsCriteria {
	    /**
	     * Number of entries to skip
	     */
	    $skip: number;
	    /**
	     * Maximum number of entries to retrieve
	     */
	    $top: number;
	    /**
	     * Alias or display name of the author
	     */
	    author: string;
	    /**
	     * If provided, the earliest commit in the graph to search
	     */
	    compareVersion: GitVersionDescriptor;
	    /**
	     * If true, don't include delete history entries
	     */
	    excludeDeletes: boolean;
	    /**
	     * If provided, a lower bound for filtering commits alphabetically
	     */
	    fromCommitId: string;
	    /**
	     * If provided, only include history entries created after this date (string)
	     */
	    fromDate: string;
	    /**
	     * If provided, specifies the exact commit ids of the commits to fetch. May not be combined with other parameters.
	     */
	    ids: string[];
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    /**
	     * Path of item to search under
	     */
	    itemPath: string;
	    /**
	     * If provided, identifies the commit or branch to search
	     */
	    itemVersion: GitVersionDescriptor;
	    /**
	     * If provided, an upper bound for filtering commits alphabetically
	     */
	    toCommitId: string;
	    /**
	     * If provided, only include history entries created before this date (string)
	     */
	    toDate: string;
	    /**
	     * Alias or display name of the committer
	     */
	    user: string;
	}
	export interface GitRef {
	    _links: any;
	    isLockedBy: VSSInterfaces.IdentityRef;
	    name: string;
	    objectId: string;
	    statuses: GitStatus[];
	    url: string;
	}
	export interface GitRefUpdate {
	    name: string;
	    newObjectId: string;
	    oldObjectId: string;
	    repositoryId: string;
	}
	export enum GitRefUpdateMode {
	    /**
	     * Indicates the Git protocol model where any refs that can be updated will be updated, but any failures will not prevent other updates from succeeding.
	     */
	    BestEffort = 0,
	    /**
	     * Indicates that all ref updates must succeed or none will succeed. All ref updates will be atomically written. If any failure is encountered, previously successful updates will be rolled back and the entire operation will fail.
	     */
	    AllOrNone = 1,
	}
	export interface GitRefUpdateResult {
	    /**
	     * Custom message for the result object For instance, Reason for failing.
	     */
	    customMessage: string;
	    /**
	     * Ref name
	     */
	    name: string;
	    /**
	     * New object ID
	     */
	    newObjectId: string;
	    /**
	     * Old object ID
	     */
	    oldObjectId: string;
	    /**
	     * Name of the plugin that rejected the updated.
	     */
	    rejectedBy: string;
	    /**
	     * Repository ID
	     */
	    repositoryId: string;
	    /**
	     * True if the ref update succeeded, false otherwise
	     */
	    success: boolean;
	    /**
	     * Status of the update from the TFS server.
	     */
	    updateStatus: GitRefUpdateStatus;
	}
	export interface GitRefUpdateResultSet {
	    countFailed: number;
	    countSucceeded: number;
	    pushCorrelationId: string;
	    pushIds: {
	        [key: string]: number;
	    };
	    pushTime: Date;
	    results: GitRefUpdateResult[];
	}
	export enum GitRefUpdateStatus {
	    /**
	     * Indicates that the ref update request was completed successfully.
	     */
	    Succeeded = 0,
	    /**
	     * Indicates that the ref update request could not be completed because part of the graph would be disconnected by this change, and the caller does not have ForcePush permission on the repository.
	     */
	    ForcePushRequired = 1,
	    /**
	     * Indicates that the ref update request could not be completed because the old object ID presented in the request was not the object ID of the ref when the database attempted the update. The most likely scenario is that the caller lost a race to update the ref.
	     */
	    StaleOldObjectId = 2,
	    /**
	     * Indicates that the ref update request could not be completed because the ref name presented in the request was not valid.
	     */
	    InvalidRefName = 3,
	    /**
	     * The request was not processed
	     */
	    Unprocessed = 4,
	    /**
	     * The ref update request could not be completed because the new object ID for the ref could not be resolved to a commit object (potentially through any number of tags)
	     */
	    UnresolvableToCommit = 5,
	    /**
	     * The ref update request could not be completed because the user lacks write permissions required to write this ref
	     */
	    WritePermissionRequired = 6,
	    /**
	     * The ref update request could not be completed because the user lacks note creation permissions required to write this note
	     */
	    ManageNotePermissionRequired = 7,
	    /**
	     * The ref update request could not be completed because the user lacks the permission to create a branch
	     */
	    CreateBranchPermissionRequired = 8,
	    /**
	     * The ref update request could not be completed because the user lacks the permission to create a tag
	     */
	    CreateTagPermissionRequired = 9,
	    /**
	     * The ref update could not be completed because it was rejected by the plugin.
	     */
	    RejectedByPlugin = 10,
	    /**
	     * The ref update could not be completed because the ref is locked by another user.
	     */
	    Locked = 11,
	    /**
	     * The ref update could not be completed because, in case-insensitive mode, the ref name conflicts with an existing, differently-cased ref name.
	     */
	    RefNameConflict = 12,
	    /**
	     * The ref update could not be completed because it was rejected by policy.
	     */
	    RejectedByPolicy = 13,
	    /**
	     * Indicates that the ref update request was completed successfully, but the ref doesn't actually exist so no changes were made.  This should only happen during deletes.
	     */
	    SucceededNonExistentRef = 14,
	    /**
	     * Indicates that the ref update request was completed successfully, but the passed-in ref was corrupt - as in, the old object ID was bad.  This should only happen during deletes.
	     */
	    SucceededCorruptRef = 15,
	}
	export interface GitRepository {
	    _links: any;
	    defaultBranch: string;
	    id: string;
	    name: string;
	    project: TfsCoreInterfaces.TeamProjectReference;
	    remoteUrl: string;
	    url: string;
	}
	export enum GitRepositoryPermissions {
	    None = 0,
	    Administer = 1,
	    GenericRead = 2,
	    GenericContribute = 4,
	    ForcePush = 8,
	    CreateBranch = 16,
	    CreateTag = 32,
	    ManageNote = 64,
	    PolicyExempt = 128,
	    /**
	     * This defines the set of bits that are valid for the git permission space. When reading or writing git permissions, these are the only bits paid attention too.
	     */
	    All = 255,
	    BranchLevelPermissions = 141,
	}
	export interface GitStatus {
	    _links: any;
	    context: GitStatusContext;
	    createdBy: VSSInterfaces.IdentityRef;
	    creationDate: Date;
	    description: string;
	    state: GitStatusState;
	    targetUrl: string;
	}
	export interface GitStatusContext {
	    genre: string;
	    name: string;
	}
	export enum GitStatusState {
	    NotSet = 0,
	    Pending = 1,
	    Succeeded = 2,
	    Failed = 3,
	    Error = 4,
	}
	export interface GitSuggestion {
	    properties: {
	        [key: string]: any;
	    };
	    type: string;
	}
	export interface GitTargetVersionDescriptor extends GitVersionDescriptor {
	    /**
	     * Version string identifier (name of tag/branch, SHA1 of commit)
	     */
	    targetVersion: string;
	    /**
	     * Version options - Specify additional modifiers to version (e.g Previous)
	     */
	    targetVersionOptions: GitVersionOptions;
	    /**
	     * Version type (branch, tag, or commit). Determines how Id is interpreted
	     */
	    targetVersionType: GitVersionType;
	}
	export interface GitTreeEntryRef {
	    /**
	     * Blob or tree
	     */
	    gitObjectType: GitObjectType;
	    /**
	     * Mode represented as octal string
	     */
	    mode: string;
	    /**
	     * SHA1 hash of git object
	     */
	    objectId: string;
	    /**
	     * Path relative to parent tree object
	     */
	    relativePath: string;
	    /**
	     * Size of content
	     */
	    size: number;
	    /**
	     * url to retrieve tree or blob
	     */
	    url: string;
	}
	export interface GitTreeRef {
	    _links: any;
	    /**
	     * SHA1 hash of git object
	     */
	    objectId: string;
	    /**
	     * Sum of sizes of all children
	     */
	    size: number;
	    /**
	     * Blobs and trees under this tree
	     */
	    treeEntries: GitTreeEntryRef[];
	    /**
	     * Url to tree
	     */
	    url: string;
	}
	export interface GitUserDate {
	    date: Date;
	    email: string;
	    name: string;
	}
	export interface GitVersionDescriptor {
	    /**
	     * Version string identifier (name of tag/branch/index, SHA1 of commit)
	     */
	    version: string;
	    /**
	     * Version options - Specify additional modifiers to version (e.g Previous)
	     */
	    versionOptions: GitVersionOptions;
	    /**
	     * Version type (branch, tag, commit, or index). Determines how Id is interpreted
	     */
	    versionType: GitVersionType;
	}
	export enum GitVersionOptions {
	    /**
	     * Not specified
	     */
	    None = 0,
	    /**
	     * Commit that changed item prior to the current version
	     */
	    PreviousChange = 1,
	    /**
	     * First parent of commit (HEAD^)
	     */
	    FirstParent = 2,
	}
	export enum GitVersionType {
	    /**
	     * Interpret the version as a branch name
	     */
	    Branch = 0,
	    /**
	     * Interpret the version as a tag name
	     */
	    Tag = 1,
	    /**
	     * Interpret the version as a commit ID (SHA1)
	     */
	    Commit = 2,
	    /**
	     * Interpret the version as an index name
	     */
	    Index = 3,
	}
	export interface HistoryEntry<T> {
	    /**
	     * The Change list (changeset/commit/shelveset) for this point in history
	     */
	    changeList: ChangeList<T>;
	    /**
	     * The change made to the item from this change list (only relevant for File history, not folders)
	     */
	    itemChangeType: VersionControlChangeType;
	    /**
	     * The path of the item at this point in history (only relevant for File history, not folders)
	     */
	    serverItem: string;
	}
	export interface HistoryQueryResults<T> {
	    /**
	     * True if there are more results available to fetch (we're returning the max # of items requested) A more RESTy solution would be to include a Link header
	     */
	    moreResultsAvailable: boolean;
	    /**
	     * The history entries (results) from this query
	     */
	    results: HistoryEntry<T>[];
	}
	export interface IdentityRefWithVote extends VSSInterfaces.IdentityRef {
	    isRequired: boolean;
	    reviewerUrl: string;
	    vote: number;
	    votedFor: IdentityRefWithVote[];
	}
	export interface IncludedGitCommit {
	    commitId: string;
	    commitTime: Date;
	    parentCommitIds: string[];
	    repositoryId: string;
	}
	export interface ItemContent {
	    content: string;
	    contentType: ItemContentType;
	}
	export enum ItemContentType {
	    RawText = 0,
	    Base64Encoded = 1,
	}
	/**
	 * Optional details to include when returning an item model
	 */
	export interface ItemDetailsOptions {
	    /**
	     * If true, include metadata about the file type
	     */
	    includeContentMetadata: boolean;
	    /**
	     * Specifies whether to include children (OneLevel), all descendants (Full) or None for folder items
	     */
	    recursionLevel: VersionControlRecursionType;
	}
	export interface ItemModel {
	    _links: any;
	    contentMetadata: FileContentMetadata;
	    isFolder: boolean;
	    isSymLink: boolean;
	    path: string;
	    url: string;
	}
	export enum PullRequestAsyncStatus {
	    NotSet = 0,
	    Queued = 1,
	    Conflicts = 2,
	    Succeeded = 3,
	    RejectedByPolicy = 4,
	    Failure = 5,
	}
	export enum PullRequestStatus {
	    NotSet = 0,
	    Active = 1,
	    Abandoned = 2,
	    Completed = 3,
	    All = 4,
	}
	export interface TfvcBranch extends TfvcBranchRef {
	    children: TfvcBranch[];
	    mappings: TfvcBranchMapping[];
	    parent: TfvcShallowBranchRef;
	    relatedBranches: TfvcShallowBranchRef[];
	}
	export interface TfvcBranchMapping {
	    depth: string;
	    serverItem: string;
	    type: string;
	}
	export interface TfvcBranchRef extends TfvcShallowBranchRef {
	    _links: any;
	    createdDate: Date;
	    description: string;
	    isDeleted: boolean;
	    owner: VSSInterfaces.IdentityRef;
	    url: string;
	}
	export interface TfvcChange extends Change<TfvcItem> {
	    /**
	     * List of merge sources in case of rename or branch creation.
	     */
	    mergeSources: TfvcMergeSource[];
	    /**
	     * Version at which a (shelved) change was pended against
	     */
	    pendingVersion: number;
	}
	export interface TfvcChangeset extends TfvcChangesetRef {
	    accountId: string;
	    changes: TfvcChange[];
	    checkinNotes: CheckinNote[];
	    collectionId: string;
	    hasMoreChanges: boolean;
	    policyOverride: TfvcPolicyOverrideInfo;
	    teamProjectIds: string[];
	    workItems: AssociatedWorkItem[];
	}
	export interface TfvcChangesetRef {
	    _links: any;
	    author: VSSInterfaces.IdentityRef;
	    changesetId: number;
	    checkedInBy: VSSInterfaces.IdentityRef;
	    comment: string;
	    commentTruncated: boolean;
	    createdDate: Date;
	    url: string;
	}
	/**
	 * Criteria used in a search for change lists
	 */
	export interface TfvcChangesetSearchCriteria {
	    /**
	     * Alias or display name of user who made the changes
	     */
	    author: string;
	    /**
	     * Whether or not to follow renames for the given item being queried
	     */
	    followRenames: boolean;
	    /**
	     * If provided, only include changesets created after this date (string) Think of a better name for this.
	     */
	    fromDate: string;
	    /**
	     * If provided, only include changesets after this changesetID
	     */
	    fromId: number;
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    /**
	     * Path of item to search under
	     */
	    path: string;
	    /**
	     * If provided, only include changesets created before this date (string) Think of a better name for this.
	     */
	    toDate: string;
	    /**
	     * If provided, a version descriptor for the latest change list to include
	     */
	    toId: number;
	}
	export interface TfvcChangesetsRequestData {
	    changesetIds: number[];
	    commentLength: number;
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	}
	export interface TfvcCheckinEventData {
	    changeset: TfvcChangeset;
	    project: TfsCoreInterfaces.TeamProjectReference;
	}
	export interface TfvcHistoryEntry extends HistoryEntry<TfvcItem> {
	    /**
	     * The encoding of the item at this point in history (only relevant for File history, not folders)
	     */
	    encoding: number;
	    /**
	     * The file id of the item at this point in history (only relevant for File history, not folders)
	     */
	    fileId: number;
	}
	export interface TfvcItem extends ItemModel {
	    changeDate: Date;
	    deletionId: number;
	    /**
	     * MD5 hash as a base 64 string, applies to files only.
	     */
	    hashValue: string;
	    isBranch: boolean;
	    isPendingChange: boolean;
	    /**
	     * The size of the file, if applicable.
	     */
	    size: number;
	    version: number;
	}
	/**
	 * Item path and Version descriptor properties
	 */
	export interface TfvcItemDescriptor {
	    path: string;
	    recursionLevel: VersionControlRecursionType;
	    version: string;
	    versionOption: TfvcVersionOption;
	    versionType: TfvcVersionType;
	}
	export interface TfvcItemRequestData {
	    /**
	     * If true, include metadata about the file type
	     */
	    includeContentMetadata: boolean;
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    itemDescriptors: TfvcItemDescriptor[];
	}
	export interface TfvcLabel extends TfvcLabelRef {
	    items: TfvcItem[];
	}
	export interface TfvcLabelRef {
	    _links: any;
	    description: string;
	    id: number;
	    labelScope: string;
	    modifiedDate: Date;
	    name: string;
	    owner: VSSInterfaces.IdentityRef;
	    url: string;
	}
	export interface TfvcLabelRequestData {
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    itemLabelFilter: string;
	    labelScope: string;
	    maxItemCount: number;
	    name: string;
	    owner: string;
	}
	export interface TfvcMergeSource {
	    /**
	     * Indicates if this a rename source. If false, it is a merge source.
	     */
	    isRename: boolean;
	    /**
	     * The server item of the merge source
	     */
	    serverItem: string;
	    /**
	     * Start of the version range
	     */
	    versionFrom: number;
	    /**
	     * End of the version range
	     */
	    versionTo: number;
	}
	export interface TfvcPolicyFailureInfo {
	    message: string;
	    policyName: string;
	}
	export interface TfvcPolicyOverrideInfo {
	    comment: string;
	    policyFailures: TfvcPolicyFailureInfo[];
	}
	export interface TfvcShallowBranchRef {
	    path: string;
	}
	export interface TfvcShelveset extends TfvcShelvesetRef {
	    changes: TfvcChange[];
	    notes: CheckinNote[];
	    policyOverride: TfvcPolicyOverrideInfo;
	    workItems: AssociatedWorkItem[];
	}
	export interface TfvcShelvesetRef {
	    _links: any;
	    comment: string;
	    commentTruncated: boolean;
	    createdDate: Date;
	    id: string;
	    name: string;
	    owner: VSSInterfaces.IdentityRef;
	    url: string;
	}
	export interface TfvcShelvesetRequestData {
	    /**
	     * Whether to include policyOverride and notes
	     */
	    includeDetails: boolean;
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    /**
	     * Whether to include workItems
	     */
	    includeWorkItems: boolean;
	    /**
	     * Max number of changes to include
	     */
	    maxChangeCount: number;
	    /**
	     * Max length of comment
	     */
	    maxCommentLength: number;
	    /**
	     * Shelveset's name
	     */
	    name: string;
	    /**
	     * Owner's ID. Could be a name or a guid.
	     */
	    owner: string;
	}
	export interface TfvcVersionDescriptor {
	    version: string;
	    versionOption: TfvcVersionOption;
	    versionType: TfvcVersionType;
	}
	export enum TfvcVersionOption {
	    None = 0,
	    Previous = 1,
	    UseRename = 2,
	}
	export enum TfvcVersionType {
	    None = 0,
	    Changeset = 1,
	    Shelveset = 2,
	    Change = 3,
	    Date = 4,
	    Latest = 5,
	    Tip = 6,
	    MergeSource = 7,
	}
	export interface UpdateRefsRequest {
	    refUpdateRequests: GitRefUpdate[];
	    updateMode: GitRefUpdateMode;
	}
	export enum VersionControlChangeType {
	    None = 0,
	    Add = 1,
	    Edit = 2,
	    Encoding = 4,
	    Rename = 8,
	    Delete = 16,
	    Undelete = 32,
	    Branch = 64,
	    Merge = 128,
	    Lock = 256,
	    Rollback = 512,
	    SourceRename = 1024,
	    TargetRename = 2048,
	    Property = 4096,
	    All = 8191,
	}
	export interface VersionControlProjectInfo {
	    defaultSourceControlType: TfsCoreInterfaces.SourceControlTypes;
	    project: TfsCoreInterfaces.TeamProjectReference;
	    supportsGit: boolean;
	    supportsTFVC: boolean;
	}
	export enum VersionControlRecursionType {
	    /**
	     * Only return the specified item.
	     */
	    None = 0,
	    /**
	     * Return the specified item and its direct children.
	     */
	    OneLevel = 1,
	    /**
	     * Return the specified item and its direct children, as well as recursive chains of nested child folders that only contain a single folder.
	     */
	    OneLevelPlusNestedEmptyFolders = 4,
	    /**
	     * Return specified item and all descendants
	     */
	    Full = 120,
	}
	export var TypeInfo: {
	    AssociatedWorkItem: {
	        fields: any;
	    };
	    Change: {
	        fields: any;
	    };
	    ChangeCountDictionary: {
	        fields: any;
	    };
	    ChangeList: {
	        fields: any;
	    };
	    ChangeListSearchCriteria: {
	        fields: any;
	    };
	    CheckinNote: {
	        fields: any;
	    };
	    FileContentMetadata: {
	        fields: any;
	    };
	    GitBaseVersionDescriptor: {
	        fields: any;
	    };
	    GitBlobRef: {
	        fields: any;
	    };
	    GitBranchStats: {
	        fields: any;
	    };
	    GitChange: {
	        fields: any;
	    };
	    GitCommit: {
	        fields: any;
	    };
	    GitCommitChanges: {
	        fields: any;
	    };
	    GitCommitDiffs: {
	        fields: any;
	    };
	    GitCommitRef: {
	        fields: any;
	    };
	    GitCommitToCreate: {
	        fields: any;
	    };
	    GitDeletedRepository: {
	        fields: any;
	    };
	    GitHistoryQueryResults: {
	        fields: any;
	    };
	    GitItem: {
	        fields: any;
	    };
	    GitItemDescriptor: {
	        fields: any;
	    };
	    GitItemRequestData: {
	        fields: any;
	    };
	    GitObjectType: {
	        enumValues: {
	            "bad": number;
	            "commit": number;
	            "tree": number;
	            "blob": number;
	            "tag": number;
	            "ext2": number;
	            "ofsDelta": number;
	            "refDelta": number;
	        };
	    };
	    GitPathAction: {
	        fields: any;
	    };
	    GitPathActions: {
	        enumValues: {
	            "none": number;
	            "edit": number;
	            "delete": number;
	            "add": number;
	            "rename": number;
	        };
	    };
	    GitPermissionScope: {
	        enumValues: {
	            "project": number;
	            "repository": number;
	            "branch": number;
	        };
	    };
	    GitPullRequest: {
	        fields: any;
	    };
	    GitPullRequestCompletionOptions: {
	        fields: any;
	    };
	    GitPullRequestSearchCriteria: {
	        fields: any;
	    };
	    GitPush: {
	        fields: any;
	    };
	    GitPushEventData: {
	        fields: any;
	    };
	    GitPushRef: {
	        fields: any;
	    };
	    GitPushSearchCriteria: {
	        fields: any;
	    };
	    GitQueryCommitsCriteria: {
	        fields: any;
	    };
	    GitRef: {
	        fields: any;
	    };
	    GitRefUpdate: {
	        fields: any;
	    };
	    GitRefUpdateMode: {
	        enumValues: {
	            "bestEffort": number;
	            "allOrNone": number;
	        };
	    };
	    GitRefUpdateResult: {
	        fields: any;
	    };
	    GitRefUpdateResultSet: {
	        fields: any;
	    };
	    GitRefUpdateStatus: {
	        enumValues: {
	            "succeeded": number;
	            "forcePushRequired": number;
	            "staleOldObjectId": number;
	            "invalidRefName": number;
	            "unprocessed": number;
	            "unresolvableToCommit": number;
	            "writePermissionRequired": number;
	            "manageNotePermissionRequired": number;
	            "createBranchPermissionRequired": number;
	            "createTagPermissionRequired": number;
	            "rejectedByPlugin": number;
	            "locked": number;
	            "refNameConflict": number;
	            "rejectedByPolicy": number;
	            "succeededNonExistentRef": number;
	            "succeededCorruptRef": number;
	        };
	    };
	    GitRepository: {
	        fields: any;
	    };
	    GitRepositoryPermissions: {
	        enumValues: {
	            "none": number;
	            "administer": number;
	            "genericRead": number;
	            "genericContribute": number;
	            "forcePush": number;
	            "createBranch": number;
	            "createTag": number;
	            "manageNote": number;
	            "policyExempt": number;
	            "all": number;
	            "branchLevelPermissions": number;
	        };
	    };
	    GitStatus: {
	        fields: any;
	    };
	    GitStatusContext: {
	        fields: any;
	    };
	    GitStatusState: {
	        enumValues: {
	            "notSet": number;
	            "pending": number;
	            "succeeded": number;
	            "failed": number;
	            "error": number;
	        };
	    };
	    GitSuggestion: {
	        fields: any;
	    };
	    GitTargetVersionDescriptor: {
	        fields: any;
	    };
	    GitTreeEntryRef: {
	        fields: any;
	    };
	    GitTreeRef: {
	        fields: any;
	    };
	    GitUserDate: {
	        fields: any;
	    };
	    GitVersionDescriptor: {
	        fields: any;
	    };
	    GitVersionOptions: {
	        enumValues: {
	            "none": number;
	            "previousChange": number;
	            "firstParent": number;
	        };
	    };
	    GitVersionType: {
	        enumValues: {
	            "branch": number;
	            "tag": number;
	            "commit": number;
	            "index": number;
	        };
	    };
	    HistoryEntry: {
	        fields: any;
	    };
	    HistoryQueryResults: {
	        fields: any;
	    };
	    IdentityRefWithVote: {
	        fields: any;
	    };
	    IncludedGitCommit: {
	        fields: any;
	    };
	    ItemContent: {
	        fields: any;
	    };
	    ItemContentType: {
	        enumValues: {
	            "rawText": number;
	            "base64Encoded": number;
	        };
	    };
	    ItemDetailsOptions: {
	        fields: any;
	    };
	    ItemModel: {
	        fields: any;
	    };
	    PullRequestAsyncStatus: {
	        enumValues: {
	            "notSet": number;
	            "queued": number;
	            "conflicts": number;
	            "succeeded": number;
	            "rejectedByPolicy": number;
	            "failure": number;
	        };
	    };
	    PullRequestStatus: {
	        enumValues: {
	            "notSet": number;
	            "active": number;
	            "abandoned": number;
	            "completed": number;
	            "all": number;
	        };
	    };
	    TfvcBranch: {
	        fields: any;
	    };
	    TfvcBranchMapping: {
	        fields: any;
	    };
	    TfvcBranchRef: {
	        fields: any;
	    };
	    TfvcChange: {
	        fields: any;
	    };
	    TfvcChangeset: {
	        fields: any;
	    };
	    TfvcChangesetRef: {
	        fields: any;
	    };
	    TfvcChangesetSearchCriteria: {
	        fields: any;
	    };
	    TfvcChangesetsRequestData: {
	        fields: any;
	    };
	    TfvcCheckinEventData: {
	        fields: any;
	    };
	    TfvcHistoryEntry: {
	        fields: any;
	    };
	    TfvcItem: {
	        fields: any;
	    };
	    TfvcItemDescriptor: {
	        fields: any;
	    };
	    TfvcItemRequestData: {
	        fields: any;
	    };
	    TfvcLabel: {
	        fields: any;
	    };
	    TfvcLabelRef: {
	        fields: any;
	    };
	    TfvcLabelRequestData: {
	        fields: any;
	    };
	    TfvcMergeSource: {
	        fields: any;
	    };
	    TfvcPolicyFailureInfo: {
	        fields: any;
	    };
	    TfvcPolicyOverrideInfo: {
	        fields: any;
	    };
	    TfvcShallowBranchRef: {
	        fields: any;
	    };
	    TfvcShelveset: {
	        fields: any;
	    };
	    TfvcShelvesetRef: {
	        fields: any;
	    };
	    TfvcShelvesetRequestData: {
	        fields: any;
	    };
	    TfvcVersionDescriptor: {
	        fields: any;
	    };
	    TfvcVersionOption: {
	        enumValues: {
	            "none": number;
	            "previous": number;
	            "useRename": number;
	        };
	    };
	    TfvcVersionType: {
	        enumValues: {
	            "none": number;
	            "changeset": number;
	            "shelveset": number;
	            "change": number;
	            "date": number;
	            "latest": number;
	            "tip": number;
	            "mergeSource": number;
	        };
	    };
	    UpdateRefsRequest: {
	        fields: any;
	    };
	    VersionControlChangeType: {
	        enumValues: {
	            "none": number;
	            "add": number;
	            "edit": number;
	            "encoding": number;
	            "rename": number;
	            "delete": number;
	            "undelete": number;
	            "branch": number;
	            "merge": number;
	            "lock": number;
	            "rollback": number;
	            "sourceRename": number;
	            "targetRename": number;
	            "property": number;
	            "all": number;
	        };
	    };
	    VersionControlProjectInfo: {
	        fields: any;
	    };
	    VersionControlRecursionType: {
	        enumValues: {
	            "none": number;
	            "oneLevel": number;
	            "oneLevelPlusNestedEmptyFolders": number;
	            "full": number;
	        };
	    };
	};

}
declare module 'vso-node-api/GitApi' {
	/// <reference path="../node/node.d.ts" />
	/// <reference path="../q/Q.d.ts" />
	import Q = require('q');
	import basem = require('vso-node-api/ClientApiBases');
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	import GitInterfaces = require('vso-node-api/interfaces/GitInterfaces');
	import VSSInterfaces = require('vso-node-api/interfaces/common/VSSInterfaces');
	export interface IGitApi extends basem.ClientApiBase {
	    getBlob(repositoryId: string, sha1: string, project: string, download: boolean, fileName: string, onResult: (err: any, statusCode: number, Blob: GitInterfaces.GitBlobRef) => void): void;
	    getBlobContent(repositoryId: string, sha1: string, project: string, download: boolean, fileName: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getBlobsZip(blobIds: string[], repositoryId: string, project: string, filename: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getBlobZip(repositoryId: string, sha1: string, project: string, download: boolean, fileName: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getBranch(repositoryId: string, name: string, project: string, baseVersionDescriptor: GitInterfaces.GitVersionDescriptor, onResult: (err: any, statusCode: number, BranchStat: GitInterfaces.GitBranchStats) => void): void;
	    getBranches(repositoryId: string, project: string, baseVersionDescriptor: GitInterfaces.GitVersionDescriptor, onResult: (err: any, statusCode: number, BranchStats: GitInterfaces.GitBranchStats[]) => void): void;
	    getChanges(commitId: string, repositoryId: string, project: string, top: number, skip: number, onResult: (err: any, statusCode: number, Change: GitInterfaces.GitCommitChanges) => void): void;
	    getCommit(commitId: string, repositoryId: string, project: string, changeCount: number, onResult: (err: any, statusCode: number, Commit: GitInterfaces.GitCommit) => void): void;
	    getCommits(repositoryId: string, searchCriteria: GitInterfaces.GitQueryCommitsCriteria, project: string, skip: number, top: number, onResult: (err: any, statusCode: number, Commits: GitInterfaces.GitCommitRef[]) => void): void;
	    getPushCommits(repositoryId: string, pushId: number, project: string, top: number, skip: number, includeLinks: boolean, onResult: (err: any, statusCode: number, Commits: GitInterfaces.GitCommitRef[]) => void): void;
	    getCommitsBatch(searchCriteria: GitInterfaces.GitQueryCommitsCriteria, repositoryId: string, project: string, skip: number, top: number, onResult: (err: any, statusCode: number, CommitsBatch: GitInterfaces.GitCommitRef[]) => void): void;
	    getDeletedRepositories(project: string, onResult: (err: any, statusCode: number, DeletedRepositories: GitInterfaces.GitDeletedRepository[]) => void): void;
	    getItem(repositoryId: string, path: string, project: string, scopePath: string, recursionLevel: GitInterfaces.VersionControlRecursionType, includeContentMetadata: boolean, latestProcessedChange: boolean, download: boolean, versionDescriptor: GitInterfaces.GitVersionDescriptor, onResult: (err: any, statusCode: number, Item: GitInterfaces.GitItem) => void): void;
	    getItemContent(repositoryId: string, path: string, project: string, scopePath: string, recursionLevel: GitInterfaces.VersionControlRecursionType, includeContentMetadata: boolean, latestProcessedChange: boolean, download: boolean, versionDescriptor: GitInterfaces.GitVersionDescriptor, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getItems(repositoryId: string, project: string, scopePath: string, recursionLevel: GitInterfaces.VersionControlRecursionType, includeContentMetadata: boolean, latestProcessedChange: boolean, download: boolean, includeLinks: boolean, versionDescriptor: GitInterfaces.GitVersionDescriptor, onResult: (err: any, statusCode: number, Items: GitInterfaces.GitItem[]) => void): void;
	    getItemText(repositoryId: string, path: string, project: string, scopePath: string, recursionLevel: GitInterfaces.VersionControlRecursionType, includeContentMetadata: boolean, latestProcessedChange: boolean, download: boolean, versionDescriptor: GitInterfaces.GitVersionDescriptor, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getItemZip(repositoryId: string, path: string, project: string, scopePath: string, recursionLevel: GitInterfaces.VersionControlRecursionType, includeContentMetadata: boolean, latestProcessedChange: boolean, download: boolean, versionDescriptor: GitInterfaces.GitVersionDescriptor, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getItemsBatch(requestData: GitInterfaces.GitItemRequestData, repositoryId: string, project: string, onResult: (err: any, statusCode: number, ItemsBatch: GitInterfaces.GitItem[][]) => void): void;
	    getPullRequestCommits(repositoryId: string, pullRequestId: number, project: string, onResult: (err: any, statusCode: number, PullRequestCommits: GitInterfaces.GitCommitRef[]) => void): void;
	    createPullRequestReviewer(reviewer: GitInterfaces.IdentityRefWithVote, repositoryId: string, pullRequestId: number, reviewerId: string, project: string, onResult: (err: any, statusCode: number, PullRequestReviewer: GitInterfaces.IdentityRefWithVote) => void): void;
	    createPullRequestReviewers(reviewers: VSSInterfaces.IdentityRef[], repositoryId: string, pullRequestId: number, project: string, onResult: (err: any, statusCode: number, PullRequestReviewers: GitInterfaces.IdentityRefWithVote[]) => void): void;
	    deletePullRequestReviewer(repositoryId: string, pullRequestId: number, reviewerId: string, project: string, onResult: (err: any, statusCode: number) => void): void;
	    getPullRequestReviewer(repositoryId: string, pullRequestId: number, reviewerId: string, project: string, onResult: (err: any, statusCode: number, PullRequestReviewer: GitInterfaces.IdentityRefWithVote) => void): void;
	    getPullRequestReviewers(repositoryId: string, pullRequestId: number, project: string, onResult: (err: any, statusCode: number, PullRequestReviewers: GitInterfaces.IdentityRefWithVote[]) => void): void;
	    getPullRequestsByProject(project: string, searchCriteria: GitInterfaces.GitPullRequestSearchCriteria, maxCommentLength: number, skip: number, top: number, onResult: (err: any, statusCode: number, PullRequests: GitInterfaces.GitPullRequest[]) => void): void;
	    createPullRequest(gitPullRequestToCreate: GitInterfaces.GitPullRequest, repositoryId: string, project: string, onResult: (err: any, statusCode: number, PullRequest: GitInterfaces.GitPullRequest) => void): void;
	    getPullRequest(repositoryId: string, pullRequestId: number, project: string, maxCommentLength: number, skip: number, top: number, includeCommits: boolean, onResult: (err: any, statusCode: number, PullRequest: GitInterfaces.GitPullRequest) => void): void;
	    getPullRequests(repositoryId: string, searchCriteria: GitInterfaces.GitPullRequestSearchCriteria, project: string, maxCommentLength: number, skip: number, top: number, onResult: (err: any, statusCode: number, PullRequests: GitInterfaces.GitPullRequest[]) => void): void;
	    updatePullRequest(gitPullRequestToUpdate: GitInterfaces.GitPullRequest, repositoryId: string, pullRequestId: number, project: string, onResult: (err: any, statusCode: number, PullRequest: GitInterfaces.GitPullRequest) => void): void;
	    getPullRequestWorkItems(repositoryId: string, pullRequestId: number, project: string, commitsTop: number, commitsSkip: number, onResult: (err: any, statusCode: number, PullRequestWorkItems: GitInterfaces.AssociatedWorkItem[]) => void): void;
	    createPush(push: GitInterfaces.GitPush, repositoryId: string, project: string, onResult: (err: any, statusCode: number, pushe: GitInterfaces.GitPush) => void): void;
	    getPush(repositoryId: string, pushId: number, project: string, includeCommits: number, includeRefUpdates: boolean, onResult: (err: any, statusCode: number, pushe: GitInterfaces.GitPush) => void): void;
	    getPushes(repositoryId: string, project: string, skip: number, top: number, searchCriteria: GitInterfaces.GitPushSearchCriteria, onResult: (err: any, statusCode: number, pushes: GitInterfaces.GitPush[]) => void): void;
	    getRefs(repositoryId: string, project: string, filter: string, includeLinks: boolean, onResult: (err: any, statusCode: number, refs: GitInterfaces.GitRef[]) => void): void;
	    updateRefs(refUpdates: GitInterfaces.GitRefUpdate[], repositoryId: string, project: string, projectId: string, onResult: (err: any, statusCode: number, refs: GitInterfaces.GitRefUpdateResult[]) => void): void;
	    createRepository(gitRepositoryToCreate: GitInterfaces.GitRepository, project: string, onResult: (err: any, statusCode: number, Repositorie: GitInterfaces.GitRepository) => void): void;
	    deleteRepository(repositoryId: string, project: string, onResult: (err: any, statusCode: number) => void): void;
	    getRepositories(project: string, includeLinks: boolean, onResult: (err: any, statusCode: number, Repositories: GitInterfaces.GitRepository[]) => void): void;
	    getRepository(repositoryId: string, project: string, onResult: (err: any, statusCode: number, Repositorie: GitInterfaces.GitRepository) => void): void;
	    updateRepository(newRepositoryInfo: GitInterfaces.GitRepository, repositoryId: string, project: string, onResult: (err: any, statusCode: number, Repositorie: GitInterfaces.GitRepository) => void): void;
	    createCommitStatus(gitCommitStatusToCreate: GitInterfaces.GitStatus, commitId: string, repositoryId: string, project: string, onResult: (err: any, statusCode: number, Statuse: GitInterfaces.GitStatus) => void): void;
	    getStatuses(commitId: string, repositoryId: string, project: string, top: number, skip: number, onResult: (err: any, statusCode: number, Statuses: GitInterfaces.GitStatus[]) => void): void;
	    getTree(repositoryId: string, sha1: string, project: string, projectId: string, recursive: boolean, fileName: string, onResult: (err: any, statusCode: number, Tree: GitInterfaces.GitTreeRef) => void): void;
	    getTreeZip(repositoryId: string, sha1: string, project: string, projectId: string, recursive: boolean, fileName: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	}
	export interface IQGitApi extends basem.QClientApiBase {
	    getBlob(repositoryId: string, sha1: string, project?: string, download?: boolean, fileName?: string): Q.Promise<GitInterfaces.GitBlobRef>;
	    getBlobContent(repositoryId: string, sha1: string, project?: string, download?: boolean, fileName?: string): Q.Promise<NodeJS.ReadableStream>;
	    getBlobsZip(blobIds: string[], repositoryId: string, project?: string, filename?: string): Q.Promise<NodeJS.ReadableStream>;
	    getBlobZip(repositoryId: string, sha1: string, project?: string, download?: boolean, fileName?: string): Q.Promise<NodeJS.ReadableStream>;
	    getBranch(repositoryId: string, name: string, project?: string, baseVersionDescriptor?: GitInterfaces.GitVersionDescriptor): Q.Promise<GitInterfaces.GitBranchStats>;
	    getBranches(repositoryId: string, project?: string, baseVersionDescriptor?: GitInterfaces.GitVersionDescriptor): Q.Promise<GitInterfaces.GitBranchStats[]>;
	    getChanges(commitId: string, repositoryId: string, project?: string, top?: number, skip?: number): Q.Promise<GitInterfaces.GitCommitChanges>;
	    getCommit(commitId: string, repositoryId: string, project?: string, changeCount?: number): Q.Promise<GitInterfaces.GitCommit>;
	    getCommits(repositoryId: string, searchCriteria: GitInterfaces.GitQueryCommitsCriteria, project?: string, skip?: number, top?: number): Q.Promise<GitInterfaces.GitCommitRef[]>;
	    getPushCommits(repositoryId: string, pushId: number, project?: string, top?: number, skip?: number, includeLinks?: boolean): Q.Promise<GitInterfaces.GitCommitRef[]>;
	    getCommitsBatch(searchCriteria: GitInterfaces.GitQueryCommitsCriteria, repositoryId: string, project?: string, skip?: number, top?: number): Q.Promise<GitInterfaces.GitCommitRef[]>;
	    getDeletedRepositories(project: string): Q.Promise<GitInterfaces.GitDeletedRepository[]>;
	    getItem(repositoryId: string, path: string, project?: string, scopePath?: string, recursionLevel?: GitInterfaces.VersionControlRecursionType, includeContentMetadata?: boolean, latestProcessedChange?: boolean, download?: boolean, versionDescriptor?: GitInterfaces.GitVersionDescriptor): Q.Promise<GitInterfaces.GitItem>;
	    getItemContent(repositoryId: string, path: string, project?: string, scopePath?: string, recursionLevel?: GitInterfaces.VersionControlRecursionType, includeContentMetadata?: boolean, latestProcessedChange?: boolean, download?: boolean, versionDescriptor?: GitInterfaces.GitVersionDescriptor): Q.Promise<NodeJS.ReadableStream>;
	    getItems(repositoryId: string, project?: string, scopePath?: string, recursionLevel?: GitInterfaces.VersionControlRecursionType, includeContentMetadata?: boolean, latestProcessedChange?: boolean, download?: boolean, includeLinks?: boolean, versionDescriptor?: GitInterfaces.GitVersionDescriptor): Q.Promise<GitInterfaces.GitItem[]>;
	    getItemText(repositoryId: string, path: string, project?: string, scopePath?: string, recursionLevel?: GitInterfaces.VersionControlRecursionType, includeContentMetadata?: boolean, latestProcessedChange?: boolean, download?: boolean, versionDescriptor?: GitInterfaces.GitVersionDescriptor): Q.Promise<NodeJS.ReadableStream>;
	    getItemZip(repositoryId: string, path: string, project?: string, scopePath?: string, recursionLevel?: GitInterfaces.VersionControlRecursionType, includeContentMetadata?: boolean, latestProcessedChange?: boolean, download?: boolean, versionDescriptor?: GitInterfaces.GitVersionDescriptor): Q.Promise<NodeJS.ReadableStream>;
	    getItemsBatch(requestData: GitInterfaces.GitItemRequestData, repositoryId: string, project?: string): Q.Promise<GitInterfaces.GitItem[][]>;
	    getPullRequestCommits(repositoryId: string, pullRequestId: number, project?: string): Q.Promise<GitInterfaces.GitCommitRef[]>;
	    createPullRequestReviewer(reviewer: GitInterfaces.IdentityRefWithVote, repositoryId: string, pullRequestId: number, reviewerId: string, project?: string): Q.Promise<GitInterfaces.IdentityRefWithVote>;
	    createPullRequestReviewers(reviewers: VSSInterfaces.IdentityRef[], repositoryId: string, pullRequestId: number, project?: string): Q.Promise<GitInterfaces.IdentityRefWithVote[]>;
	    deletePullRequestReviewer(repositoryId: string, pullRequestId: number, reviewerId: string, project?: string): Q.Promise<void>;
	    getPullRequestReviewer(repositoryId: string, pullRequestId: number, reviewerId: string, project?: string): Q.Promise<GitInterfaces.IdentityRefWithVote>;
	    getPullRequestReviewers(repositoryId: string, pullRequestId: number, project?: string): Q.Promise<GitInterfaces.IdentityRefWithVote[]>;
	    getPullRequestsByProject(project: string, searchCriteria: GitInterfaces.GitPullRequestSearchCriteria, maxCommentLength?: number, skip?: number, top?: number): Q.Promise<GitInterfaces.GitPullRequest[]>;
	    createPullRequest(gitPullRequestToCreate: GitInterfaces.GitPullRequest, repositoryId: string, project?: string): Q.Promise<GitInterfaces.GitPullRequest>;
	    getPullRequest(repositoryId: string, pullRequestId: number, project?: string, maxCommentLength?: number, skip?: number, top?: number, includeCommits?: boolean): Q.Promise<GitInterfaces.GitPullRequest>;
	    getPullRequests(repositoryId: string, searchCriteria: GitInterfaces.GitPullRequestSearchCriteria, project?: string, maxCommentLength?: number, skip?: number, top?: number): Q.Promise<GitInterfaces.GitPullRequest[]>;
	    updatePullRequest(gitPullRequestToUpdate: GitInterfaces.GitPullRequest, repositoryId: string, pullRequestId: number, project?: string): Q.Promise<GitInterfaces.GitPullRequest>;
	    getPullRequestWorkItems(repositoryId: string, pullRequestId: number, project?: string, commitsTop?: number, commitsSkip?: number): Q.Promise<GitInterfaces.AssociatedWorkItem[]>;
	    createPush(push: GitInterfaces.GitPush, repositoryId: string, project?: string): Q.Promise<GitInterfaces.GitPush>;
	    getPush(repositoryId: string, pushId: number, project?: string, includeCommits?: number, includeRefUpdates?: boolean): Q.Promise<GitInterfaces.GitPush>;
	    getPushes(repositoryId: string, project?: string, skip?: number, top?: number, searchCriteria?: GitInterfaces.GitPushSearchCriteria): Q.Promise<GitInterfaces.GitPush[]>;
	    getRefs(repositoryId: string, project?: string, filter?: string, includeLinks?: boolean): Q.Promise<GitInterfaces.GitRef[]>;
	    updateRefs(refUpdates: GitInterfaces.GitRefUpdate[], repositoryId: string, project?: string, projectId?: string): Q.Promise<GitInterfaces.GitRefUpdateResult[]>;
	    createRepository(gitRepositoryToCreate: GitInterfaces.GitRepository, project?: string): Q.Promise<GitInterfaces.GitRepository>;
	    deleteRepository(repositoryId: string, project?: string): Q.Promise<void>;
	    getRepositories(project?: string, includeLinks?: boolean): Q.Promise<GitInterfaces.GitRepository[]>;
	    getRepository(repositoryId: string, project?: string): Q.Promise<GitInterfaces.GitRepository>;
	    updateRepository(newRepositoryInfo: GitInterfaces.GitRepository, repositoryId: string, project?: string): Q.Promise<GitInterfaces.GitRepository>;
	    createCommitStatus(gitCommitStatusToCreate: GitInterfaces.GitStatus, commitId: string, repositoryId: string, project?: string): Q.Promise<GitInterfaces.GitStatus>;
	    getStatuses(commitId: string, repositoryId: string, project?: string, top?: number, skip?: number): Q.Promise<GitInterfaces.GitStatus[]>;
	    getTree(repositoryId: string, sha1: string, project?: string, projectId?: string, recursive?: boolean, fileName?: string): Q.Promise<GitInterfaces.GitTreeRef>;
	    getTreeZip(repositoryId: string, sha1: string, project?: string, projectId?: string, recursive?: boolean, fileName?: string): Q.Promise<NodeJS.ReadableStream>;
	}
	export class GitApi extends basem.ClientApiBase implements IGitApi {
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	     * Gets a single blob.
	     *
	     * @param {string} repositoryId
	     * @param {string} sha1
	     * @param {string} project - Project ID or project name
	     * @param {boolean} download
	     * @param {string} fileName
	     * @param onResult callback function with the resulting GitInterfaces.GitBlobRef
	     */
	    getBlob(repositoryId: string, sha1: string, project: string, download: boolean, fileName: string, onResult: (err: any, statusCode: number, Blob: GitInterfaces.GitBlobRef) => void): void;
	    /**
	     * Gets a single blob.
	     *
	     * @param {string} repositoryId
	     * @param {string} sha1
	     * @param {string} project - Project ID or project name
	     * @param {boolean} download
	     * @param {string} fileName
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getBlobContent(repositoryId: string, sha1: string, project: string, download: boolean, fileName: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Gets one or more blobs in a zip file download.
	     *
	     * @param {string[]} blobIds
	     * @param {string} repositoryId
	     * @param {string} project - Project ID or project name
	     * @param {string} filename
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getBlobsZip(blobIds: string[], repositoryId: string, project: string, filename: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Gets a single blob.
	     *
	     * @param {string} repositoryId
	     * @param {string} sha1
	     * @param {string} project - Project ID or project name
	     * @param {boolean} download
	     * @param {string} fileName
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getBlobZip(repositoryId: string, sha1: string, project: string, download: boolean, fileName: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Retrieve statistics about a single branch.
	     *
	     * @param {string} repositoryId - Friendly name or guid of repository
	     * @param {string} name - Name of the branch
	     * @param {string} project - Project ID or project name
	     * @param {GitInterfaces.GitVersionDescriptor} baseVersionDescriptor
	     * @param onResult callback function with the resulting GitInterfaces.GitBranchStats
	     */
	    getBranch(repositoryId: string, name: string, project: string, baseVersionDescriptor: GitInterfaces.GitVersionDescriptor, onResult: (err: any, statusCode: number, BranchStat: GitInterfaces.GitBranchStats) => void): void;
	    /**
	     * Retrieve statistics about all branches within a repository.
	     *
	     * @param {string} repositoryId - Friendly name or guid of repository
	     * @param {string} project - Project ID or project name
	     * @param {GitInterfaces.GitVersionDescriptor} baseVersionDescriptor
	     * @param onResult callback function with the resulting GitInterfaces.GitBranchStats[]
	     */
	    getBranches(repositoryId: string, project: string, baseVersionDescriptor: GitInterfaces.GitVersionDescriptor, onResult: (err: any, statusCode: number, BranchStats: GitInterfaces.GitBranchStats[]) => void): void;
	    /**
	     * Retrieve changes for a particular commit.
	     *
	     * @param {string} commitId - The id of the commit.
	     * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	     * @param {string} project - Project ID or project name
	     * @param {number} top - The maximum number of changes to return.
	     * @param {number} skip - The number of changes to skip.
	     * @param onResult callback function with the resulting GitInterfaces.GitCommitChanges
	     */
	    getChanges(commitId: string, repositoryId: string, project: string, top: number, skip: number, onResult: (err: any, statusCode: number, Change: GitInterfaces.GitCommitChanges) => void): void;
	    /**
	     * Retrieve a particular commit.
	     *
	     * @param {string} commitId - The id of the commit.
	     * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	     * @param {string} project - Project ID or project name
	     * @param {number} changeCount - The number of changes to include in the result.
	     * @param onResult callback function with the resulting GitInterfaces.GitCommit
	     */
	    getCommit(commitId: string, repositoryId: string, project: string, changeCount: number, onResult: (err: any, statusCode: number, Commit: GitInterfaces.GitCommit) => void): void;
	    /**
	     * Retrieve git commits for a project
	     *
	     * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	     * @param {GitInterfaces.GitQueryCommitsCriteria} searchCriteria
	     * @param {string} project - Project ID or project name
	     * @param {number} skip
	     * @param {number} top
	     * @param onResult callback function with the resulting GitInterfaces.GitCommitRef[]
	     */
	    getCommits(repositoryId: string, searchCriteria: GitInterfaces.GitQueryCommitsCriteria, project: string, skip: number, top: number, onResult: (err: any, statusCode: number, Commits: GitInterfaces.GitCommitRef[]) => void): void;
	    /**
	     * Retrieve a list of commits associated with a particular push.
	     *
	     * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	     * @param {number} pushId - The id of the push.
	     * @param {string} project - Project ID or project name
	     * @param {number} top - The maximum number of commits to return ("get the top x commits").
	     * @param {number} skip - The number of commits to skip.
	     * @param {boolean} includeLinks
	     * @param onResult callback function with the resulting GitInterfaces.GitCommitRef[]
	     */
	    getPushCommits(repositoryId: string, pushId: number, project: string, top: number, skip: number, includeLinks: boolean, onResult: (err: any, statusCode: number, Commits: GitInterfaces.GitCommitRef[]) => void): void;
	    /**
	     * Retrieve git commits for a project
	     *
	     * @param {GitInterfaces.GitQueryCommitsCriteria} searchCriteria - Search options
	     * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	     * @param {string} project - Project ID or project name
	     * @param {number} skip
	     * @param {number} top
	     * @param onResult callback function with the resulting GitInterfaces.GitCommitRef[]
	     */
	    getCommitsBatch(searchCriteria: GitInterfaces.GitQueryCommitsCriteria, repositoryId: string, project: string, skip: number, top: number, onResult: (err: any, statusCode: number, CommitsBatch: GitInterfaces.GitCommitRef[]) => void): void;
	    /**
	     * Retrieve deleted git repositories.
	     *
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting GitInterfaces.GitDeletedRepository[]
	     */
	    getDeletedRepositories(project: string, onResult: (err: any, statusCode: number, DeletedRepositories: GitInterfaces.GitDeletedRepository[]) => void): void;
	    /**
	     * Get Item Metadata and/or Content for a single item. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	     *
	     * @param {string} repositoryId
	     * @param {string} path
	     * @param {string} project - Project ID or project name
	     * @param {string} scopePath
	     * @param {GitInterfaces.VersionControlRecursionType} recursionLevel
	     * @param {boolean} includeContentMetadata
	     * @param {boolean} latestProcessedChange
	     * @param {boolean} download
	     * @param {GitInterfaces.GitVersionDescriptor} versionDescriptor
	     * @param onResult callback function with the resulting GitInterfaces.GitItem
	     */
	    getItem(repositoryId: string, path: string, project: string, scopePath: string, recursionLevel: GitInterfaces.VersionControlRecursionType, includeContentMetadata: boolean, latestProcessedChange: boolean, download: boolean, versionDescriptor: GitInterfaces.GitVersionDescriptor, onResult: (err: any, statusCode: number, Item: GitInterfaces.GitItem) => void): void;
	    /**
	     * Get Item Metadata and/or Content for a single item. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	     *
	     * @param {string} repositoryId
	     * @param {string} path
	     * @param {string} project - Project ID or project name
	     * @param {string} scopePath
	     * @param {GitInterfaces.VersionControlRecursionType} recursionLevel
	     * @param {boolean} includeContentMetadata
	     * @param {boolean} latestProcessedChange
	     * @param {boolean} download
	     * @param {GitInterfaces.GitVersionDescriptor} versionDescriptor
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getItemContent(repositoryId: string, path: string, project: string, scopePath: string, recursionLevel: GitInterfaces.VersionControlRecursionType, includeContentMetadata: boolean, latestProcessedChange: boolean, download: boolean, versionDescriptor: GitInterfaces.GitVersionDescriptor, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Get Item Metadata and/or Content for a collection of items. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	     *
	     * @param {string} repositoryId
	     * @param {string} project - Project ID or project name
	     * @param {string} scopePath
	     * @param {GitInterfaces.VersionControlRecursionType} recursionLevel
	     * @param {boolean} includeContentMetadata
	     * @param {boolean} latestProcessedChange
	     * @param {boolean} download
	     * @param {boolean} includeLinks
	     * @param {GitInterfaces.GitVersionDescriptor} versionDescriptor
	     * @param onResult callback function with the resulting GitInterfaces.GitItem[]
	     */
	    getItems(repositoryId: string, project: string, scopePath: string, recursionLevel: GitInterfaces.VersionControlRecursionType, includeContentMetadata: boolean, latestProcessedChange: boolean, download: boolean, includeLinks: boolean, versionDescriptor: GitInterfaces.GitVersionDescriptor, onResult: (err: any, statusCode: number, Items: GitInterfaces.GitItem[]) => void): void;
	    /**
	     * Get Item Metadata and/or Content for a single item. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	     *
	     * @param {string} repositoryId
	     * @param {string} path
	     * @param {string} project - Project ID or project name
	     * @param {string} scopePath
	     * @param {GitInterfaces.VersionControlRecursionType} recursionLevel
	     * @param {boolean} includeContentMetadata
	     * @param {boolean} latestProcessedChange
	     * @param {boolean} download
	     * @param {GitInterfaces.GitVersionDescriptor} versionDescriptor
	     * @param onResult callback function with the resulting string
	     */
	    getItemText(repositoryId: string, path: string, project: string, scopePath: string, recursionLevel: GitInterfaces.VersionControlRecursionType, includeContentMetadata: boolean, latestProcessedChange: boolean, download: boolean, versionDescriptor: GitInterfaces.GitVersionDescriptor, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Get Item Metadata and/or Content for a single item. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	     *
	     * @param {string} repositoryId
	     * @param {string} path
	     * @param {string} project - Project ID or project name
	     * @param {string} scopePath
	     * @param {GitInterfaces.VersionControlRecursionType} recursionLevel
	     * @param {boolean} includeContentMetadata
	     * @param {boolean} latestProcessedChange
	     * @param {boolean} download
	     * @param {GitInterfaces.GitVersionDescriptor} versionDescriptor
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getItemZip(repositoryId: string, path: string, project: string, scopePath: string, recursionLevel: GitInterfaces.VersionControlRecursionType, includeContentMetadata: boolean, latestProcessedChange: boolean, download: boolean, versionDescriptor: GitInterfaces.GitVersionDescriptor, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Post for retrieving a creating a batch out of a set of items in a repo / project given a list of paths or a long path
	     *
	     * @param {GitInterfaces.GitItemRequestData} requestData
	     * @param {string} repositoryId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting GitInterfaces.GitItem[][]
	     */
	    getItemsBatch(requestData: GitInterfaces.GitItemRequestData, repositoryId: string, project: string, onResult: (err: any, statusCode: number, ItemsBatch: GitInterfaces.GitItem[][]) => void): void;
	    /**
	     * Retrieve pull request's commits
	     *
	     * @param {string} repositoryId
	     * @param {number} pullRequestId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting GitInterfaces.GitCommitRef[]
	     */
	    getPullRequestCommits(repositoryId: string, pullRequestId: number, project: string, onResult: (err: any, statusCode: number, PullRequestCommits: GitInterfaces.GitCommitRef[]) => void): void;
	    /**
	     * Adds a reviewer to a git pull request
	     *
	     * @param {GitInterfaces.IdentityRefWithVote} reviewer
	     * @param {string} repositoryId
	     * @param {number} pullRequestId
	     * @param {string} reviewerId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting GitInterfaces.IdentityRefWithVote
	     */
	    createPullRequestReviewer(reviewer: GitInterfaces.IdentityRefWithVote, repositoryId: string, pullRequestId: number, reviewerId: string, project: string, onResult: (err: any, statusCode: number, PullRequestReviewer: GitInterfaces.IdentityRefWithVote) => void): void;
	    /**
	     * Adds reviewers to a git pull request
	     *
	     * @param {VSSInterfaces.IdentityRef[]} reviewers
	     * @param {string} repositoryId
	     * @param {number} pullRequestId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting GitInterfaces.IdentityRefWithVote[]
	     */
	    createPullRequestReviewers(reviewers: VSSInterfaces.IdentityRef[], repositoryId: string, pullRequestId: number, project: string, onResult: (err: any, statusCode: number, PullRequestReviewers: GitInterfaces.IdentityRefWithVote[]) => void): void;
	    /**
	     * Adds reviewers to a git pull request
	     *
	     * @param {string} repositoryId
	     * @param {number} pullRequestId
	     * @param {string} reviewerId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function
	     */
	    deletePullRequestReviewer(repositoryId: string, pullRequestId: number, reviewerId: string, project: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * Retrieve a reviewer from a pull request
	     *
	     * @param {string} repositoryId
	     * @param {number} pullRequestId
	     * @param {string} reviewerId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting GitInterfaces.IdentityRefWithVote
	     */
	    getPullRequestReviewer(repositoryId: string, pullRequestId: number, reviewerId: string, project: string, onResult: (err: any, statusCode: number, PullRequestReviewer: GitInterfaces.IdentityRefWithVote) => void): void;
	    /**
	     * Retrieve a pull request reviewers
	     *
	     * @param {string} repositoryId
	     * @param {number} pullRequestId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting GitInterfaces.IdentityRefWithVote[]
	     */
	    getPullRequestReviewers(repositoryId: string, pullRequestId: number, project: string, onResult: (err: any, statusCode: number, PullRequestReviewers: GitInterfaces.IdentityRefWithVote[]) => void): void;
	    /**
	     * Query pull requests by project
	     *
	     * @param {string} project - Project ID or project name
	     * @param {GitInterfaces.GitPullRequestSearchCriteria} searchCriteria
	     * @param {number} maxCommentLength
	     * @param {number} skip
	     * @param {number} top
	     * @param onResult callback function with the resulting GitInterfaces.GitPullRequest[]
	     */
	    getPullRequestsByProject(project: string, searchCriteria: GitInterfaces.GitPullRequestSearchCriteria, maxCommentLength: number, skip: number, top: number, onResult: (err: any, statusCode: number, PullRequests: GitInterfaces.GitPullRequest[]) => void): void;
	    /**
	     * Create a git pull request
	     *
	     * @param {GitInterfaces.GitPullRequest} gitPullRequestToCreate
	     * @param {string} repositoryId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting GitInterfaces.GitPullRequest
	     */
	    createPullRequest(gitPullRequestToCreate: GitInterfaces.GitPullRequest, repositoryId: string, project: string, onResult: (err: any, statusCode: number, PullRequest: GitInterfaces.GitPullRequest) => void): void;
	    /**
	     * Retrieve a pull request
	     *
	     * @param {string} repositoryId
	     * @param {number} pullRequestId
	     * @param {string} project - Project ID or project name
	     * @param {number} maxCommentLength
	     * @param {number} skip
	     * @param {number} top
	     * @param {boolean} includeCommits
	     * @param onResult callback function with the resulting GitInterfaces.GitPullRequest
	     */
	    getPullRequest(repositoryId: string, pullRequestId: number, project: string, maxCommentLength: number, skip: number, top: number, includeCommits: boolean, onResult: (err: any, statusCode: number, PullRequest: GitInterfaces.GitPullRequest) => void): void;
	    /**
	     * Query for pull requests
	     *
	     * @param {string} repositoryId
	     * @param {GitInterfaces.GitPullRequestSearchCriteria} searchCriteria
	     * @param {string} project - Project ID or project name
	     * @param {number} maxCommentLength
	     * @param {number} skip
	     * @param {number} top
	     * @param onResult callback function with the resulting GitInterfaces.GitPullRequest[]
	     */
	    getPullRequests(repositoryId: string, searchCriteria: GitInterfaces.GitPullRequestSearchCriteria, project: string, maxCommentLength: number, skip: number, top: number, onResult: (err: any, statusCode: number, PullRequests: GitInterfaces.GitPullRequest[]) => void): void;
	    /**
	     * Updates a pull request
	     *
	     * @param {GitInterfaces.GitPullRequest} gitPullRequestToUpdate
	     * @param {string} repositoryId
	     * @param {number} pullRequestId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting GitInterfaces.GitPullRequest
	     */
	    updatePullRequest(gitPullRequestToUpdate: GitInterfaces.GitPullRequest, repositoryId: string, pullRequestId: number, project: string, onResult: (err: any, statusCode: number, PullRequest: GitInterfaces.GitPullRequest) => void): void;
	    /**
	     * Retrieve a pull request work items
	     *
	     * @param {string} repositoryId
	     * @param {number} pullRequestId
	     * @param {string} project - Project ID or project name
	     * @param {number} commitsTop
	     * @param {number} commitsSkip
	     * @param onResult callback function with the resulting GitInterfaces.AssociatedWorkItem[]
	     */
	    getPullRequestWorkItems(repositoryId: string, pullRequestId: number, project: string, commitsTop: number, commitsSkip: number, onResult: (err: any, statusCode: number, PullRequestWorkItems: GitInterfaces.AssociatedWorkItem[]) => void): void;
	    /**
	     * Push changes to the repository.
	     *
	     * @param {GitInterfaces.GitPush} push
	     * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, a project-scoped route must be used.
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting GitInterfaces.GitPush
	     */
	    createPush(push: GitInterfaces.GitPush, repositoryId: string, project: string, onResult: (err: any, statusCode: number, pushe: GitInterfaces.GitPush) => void): void;
	    /**
	     * Retrieve a particular push.
	     *
	     * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	     * @param {number} pushId - The id of the push.
	     * @param {string} project - Project ID or project name
	     * @param {number} includeCommits - The number of commits to include in the result.
	     * @param {boolean} includeRefUpdates
	     * @param onResult callback function with the resulting GitInterfaces.GitPush
	     */
	    getPush(repositoryId: string, pushId: number, project: string, includeCommits: number, includeRefUpdates: boolean, onResult: (err: any, statusCode: number, pushe: GitInterfaces.GitPush) => void): void;
	    /**
	     * Retrieves pushes associated with the specified repository.
	     *
	     * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	     * @param {string} project - Project ID or project name
	     * @param {number} skip
	     * @param {number} top
	     * @param {GitInterfaces.GitPushSearchCriteria} searchCriteria
	     * @param onResult callback function with the resulting GitInterfaces.GitPush[]
	     */
	    getPushes(repositoryId: string, project: string, skip: number, top: number, searchCriteria: GitInterfaces.GitPushSearchCriteria, onResult: (err: any, statusCode: number, pushes: GitInterfaces.GitPush[]) => void): void;
	    /**
	     * Queries the provided repository for its refs and returns them.
	     *
	     * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	     * @param {string} project - Project ID or project name
	     * @param {string} filter - [optional] A filter to apply to the refs.
	     * @param {boolean} includeLinks - [optional] Specifies if referenceLinks should be included in the result. default is false.
	     * @param onResult callback function with the resulting GitInterfaces.GitRef[]
	     */
	    getRefs(repositoryId: string, project: string, filter: string, includeLinks: boolean, onResult: (err: any, statusCode: number, refs: GitInterfaces.GitRef[]) => void): void;
	    /**
	     * Creates or updates refs with the given information
	     *
	     * @param {GitInterfaces.GitRefUpdate[]} refUpdates - List of ref updates to attempt to perform
	     * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	     * @param {string} project - Project ID or project name
	     * @param {string} projectId - The id of the project.
	     * @param onResult callback function with the resulting GitInterfaces.GitRefUpdateResult[]
	     */
	    updateRefs(refUpdates: GitInterfaces.GitRefUpdate[], repositoryId: string, project: string, projectId: string, onResult: (err: any, statusCode: number, refs: GitInterfaces.GitRefUpdateResult[]) => void): void;
	    /**
	     * Create a git repository
	     *
	     * @param {GitInterfaces.GitRepository} gitRepositoryToCreate
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting GitInterfaces.GitRepository
	     */
	    createRepository(gitRepositoryToCreate: GitInterfaces.GitRepository, project: string, onResult: (err: any, statusCode: number, Repositorie: GitInterfaces.GitRepository) => void): void;
	    /**
	     * Delete a git repository
	     *
	     * @param {string} repositoryId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function
	     */
	    deleteRepository(repositoryId: string, project: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * Retrieve git repositories.
	     *
	     * @param {string} project - Project ID or project name
	     * @param {boolean} includeLinks
	     * @param onResult callback function with the resulting GitInterfaces.GitRepository[]
	     */
	    getRepositories(project: string, includeLinks: boolean, onResult: (err: any, statusCode: number, Repositories: GitInterfaces.GitRepository[]) => void): void;
	    /**
	     * @param {string} repositoryId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting GitInterfaces.GitRepository
	     */
	    getRepository(repositoryId: string, project: string, onResult: (err: any, statusCode: number, Repositorie: GitInterfaces.GitRepository) => void): void;
	    /**
	     * Updates the Git repository with the single populated change in the specified repository information.
	     *
	     * @param {GitInterfaces.GitRepository} newRepositoryInfo
	     * @param {string} repositoryId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting GitInterfaces.GitRepository
	     */
	    updateRepository(newRepositoryInfo: GitInterfaces.GitRepository, repositoryId: string, project: string, onResult: (err: any, statusCode: number, Repositorie: GitInterfaces.GitRepository) => void): void;
	    /**
	     * @param {GitInterfaces.GitStatus} gitCommitStatusToCreate
	     * @param {string} commitId
	     * @param {string} repositoryId
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting GitInterfaces.GitStatus
	     */
	    createCommitStatus(gitCommitStatusToCreate: GitInterfaces.GitStatus, commitId: string, repositoryId: string, project: string, onResult: (err: any, statusCode: number, Statuse: GitInterfaces.GitStatus) => void): void;
	    /**
	     * @param {string} commitId
	     * @param {string} repositoryId
	     * @param {string} project - Project ID or project name
	     * @param {number} top
	     * @param {number} skip
	     * @param onResult callback function with the resulting GitInterfaces.GitStatus[]
	     */
	    getStatuses(commitId: string, repositoryId: string, project: string, top: number, skip: number, onResult: (err: any, statusCode: number, Statuses: GitInterfaces.GitStatus[]) => void): void;
	    /**
	     * @param {string} repositoryId
	     * @param {string} sha1
	     * @param {string} project - Project ID or project name
	     * @param {string} projectId
	     * @param {boolean} recursive
	     * @param {string} fileName
	     * @param onResult callback function with the resulting GitInterfaces.GitTreeRef
	     */
	    getTree(repositoryId: string, sha1: string, project: string, projectId: string, recursive: boolean, fileName: string, onResult: (err: any, statusCode: number, Tree: GitInterfaces.GitTreeRef) => void): void;
	    /**
	     * @param {string} repositoryId
	     * @param {string} sha1
	     * @param {string} project - Project ID or project name
	     * @param {string} projectId
	     * @param {boolean} recursive
	     * @param {string} fileName
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getTreeZip(repositoryId: string, sha1: string, project: string, projectId: string, recursive: boolean, fileName: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	}
	export class QGitApi extends basem.QClientApiBase implements IQGitApi {
	    api: GitApi;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	    * Gets a single blob.
	    *
	    * @param {string} repositoryId
	    * @param {string} sha1
	    * @param {string} project - Project ID or project name
	    * @param {boolean} download
	    * @param {string} fileName
	    */
	    getBlob(repositoryId: string, sha1: string, project?: string, download?: boolean, fileName?: string): Q.Promise<GitInterfaces.GitBlobRef>;
	    /**
	    * Gets a single blob.
	    *
	    * @param {string} repositoryId
	    * @param {string} sha1
	    * @param {string} project - Project ID or project name
	    * @param {boolean} download
	    * @param {string} fileName
	    */
	    getBlobContent(repositoryId: string, sha1: string, project?: string, download?: boolean, fileName?: string): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Gets one or more blobs in a zip file download.
	    *
	    * @param {string[]} blobIds
	    * @param {string} repositoryId
	    * @param {string} project - Project ID or project name
	    * @param {string} filename
	    */
	    getBlobsZip(blobIds: string[], repositoryId: string, project?: string, filename?: string): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Gets a single blob.
	    *
	    * @param {string} repositoryId
	    * @param {string} sha1
	    * @param {string} project - Project ID or project name
	    * @param {boolean} download
	    * @param {string} fileName
	    */
	    getBlobZip(repositoryId: string, sha1: string, project?: string, download?: boolean, fileName?: string): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Retrieve statistics about a single branch.
	    *
	    * @param {string} repositoryId - Friendly name or guid of repository
	    * @param {string} name - Name of the branch
	    * @param {string} project - Project ID or project name
	    * @param {GitInterfaces.GitVersionDescriptor} baseVersionDescriptor
	    */
	    getBranch(repositoryId: string, name: string, project?: string, baseVersionDescriptor?: GitInterfaces.GitVersionDescriptor): Q.Promise<GitInterfaces.GitBranchStats>;
	    /**
	    * Retrieve statistics about all branches within a repository.
	    *
	    * @param {string} repositoryId - Friendly name or guid of repository
	    * @param {string} project - Project ID or project name
	    * @param {GitInterfaces.GitVersionDescriptor} baseVersionDescriptor
	    */
	    getBranches(repositoryId: string, project?: string, baseVersionDescriptor?: GitInterfaces.GitVersionDescriptor): Q.Promise<GitInterfaces.GitBranchStats[]>;
	    /**
	    * Retrieve changes for a particular commit.
	    *
	    * @param {string} commitId - The id of the commit.
	    * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	    * @param {string} project - Project ID or project name
	    * @param {number} top - The maximum number of changes to return.
	    * @param {number} skip - The number of changes to skip.
	    */
	    getChanges(commitId: string, repositoryId: string, project?: string, top?: number, skip?: number): Q.Promise<GitInterfaces.GitCommitChanges>;
	    /**
	    * Retrieve a particular commit.
	    *
	    * @param {string} commitId - The id of the commit.
	    * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	    * @param {string} project - Project ID or project name
	    * @param {number} changeCount - The number of changes to include in the result.
	    */
	    getCommit(commitId: string, repositoryId: string, project?: string, changeCount?: number): Q.Promise<GitInterfaces.GitCommit>;
	    /**
	    * Retrieve git commits for a project
	    *
	    * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	    * @param {GitInterfaces.GitQueryCommitsCriteria} searchCriteria
	    * @param {string} project - Project ID or project name
	    * @param {number} skip
	    * @param {number} top
	    */
	    getCommits(repositoryId: string, searchCriteria: GitInterfaces.GitQueryCommitsCriteria, project?: string, skip?: number, top?: number): Q.Promise<GitInterfaces.GitCommitRef[]>;
	    /**
	    * Retrieve a list of commits associated with a particular push.
	    *
	    * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	    * @param {number} pushId - The id of the push.
	    * @param {string} project - Project ID or project name
	    * @param {number} top - The maximum number of commits to return ("get the top x commits").
	    * @param {number} skip - The number of commits to skip.
	    * @param {boolean} includeLinks
	    */
	    getPushCommits(repositoryId: string, pushId: number, project?: string, top?: number, skip?: number, includeLinks?: boolean): Q.Promise<GitInterfaces.GitCommitRef[]>;
	    /**
	    * Retrieve git commits for a project
	    *
	    * @param {GitInterfaces.GitQueryCommitsCriteria} searchCriteria - Search options
	    * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	    * @param {string} project - Project ID or project name
	    * @param {number} skip
	    * @param {number} top
	    */
	    getCommitsBatch(searchCriteria: GitInterfaces.GitQueryCommitsCriteria, repositoryId: string, project?: string, skip?: number, top?: number): Q.Promise<GitInterfaces.GitCommitRef[]>;
	    /**
	    * Retrieve deleted git repositories.
	    *
	    * @param {string} project - Project ID or project name
	    */
	    getDeletedRepositories(project: string): Q.Promise<GitInterfaces.GitDeletedRepository[]>;
	    /**
	    * Get Item Metadata and/or Content for a single item. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	    *
	    * @param {string} repositoryId
	    * @param {string} path
	    * @param {string} project - Project ID or project name
	    * @param {string} scopePath
	    * @param {GitInterfaces.VersionControlRecursionType} recursionLevel
	    * @param {boolean} includeContentMetadata
	    * @param {boolean} latestProcessedChange
	    * @param {boolean} download
	    * @param {GitInterfaces.GitVersionDescriptor} versionDescriptor
	    */
	    getItem(repositoryId: string, path: string, project?: string, scopePath?: string, recursionLevel?: GitInterfaces.VersionControlRecursionType, includeContentMetadata?: boolean, latestProcessedChange?: boolean, download?: boolean, versionDescriptor?: GitInterfaces.GitVersionDescriptor): Q.Promise<GitInterfaces.GitItem>;
	    /**
	    * Get Item Metadata and/or Content for a single item. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	    *
	    * @param {string} repositoryId
	    * @param {string} path
	    * @param {string} project - Project ID or project name
	    * @param {string} scopePath
	    * @param {GitInterfaces.VersionControlRecursionType} recursionLevel
	    * @param {boolean} includeContentMetadata
	    * @param {boolean} latestProcessedChange
	    * @param {boolean} download
	    * @param {GitInterfaces.GitVersionDescriptor} versionDescriptor
	    */
	    getItemContent(repositoryId: string, path: string, project?: string, scopePath?: string, recursionLevel?: GitInterfaces.VersionControlRecursionType, includeContentMetadata?: boolean, latestProcessedChange?: boolean, download?: boolean, versionDescriptor?: GitInterfaces.GitVersionDescriptor): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Get Item Metadata and/or Content for a collection of items. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	    *
	    * @param {string} repositoryId
	    * @param {string} project - Project ID or project name
	    * @param {string} scopePath
	    * @param {GitInterfaces.VersionControlRecursionType} recursionLevel
	    * @param {boolean} includeContentMetadata
	    * @param {boolean} latestProcessedChange
	    * @param {boolean} download
	    * @param {boolean} includeLinks
	    * @param {GitInterfaces.GitVersionDescriptor} versionDescriptor
	    */
	    getItems(repositoryId: string, project?: string, scopePath?: string, recursionLevel?: GitInterfaces.VersionControlRecursionType, includeContentMetadata?: boolean, latestProcessedChange?: boolean, download?: boolean, includeLinks?: boolean, versionDescriptor?: GitInterfaces.GitVersionDescriptor): Q.Promise<GitInterfaces.GitItem[]>;
	    /**
	    * Get Item Metadata and/or Content for a single item. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	    *
	    * @param {string} repositoryId
	    * @param {string} path
	    * @param {string} project - Project ID or project name
	    * @param {string} scopePath
	    * @param {GitInterfaces.VersionControlRecursionType} recursionLevel
	    * @param {boolean} includeContentMetadata
	    * @param {boolean} latestProcessedChange
	    * @param {boolean} download
	    * @param {GitInterfaces.GitVersionDescriptor} versionDescriptor
	    */
	    getItemText(repositoryId: string, path: string, project?: string, scopePath?: string, recursionLevel?: GitInterfaces.VersionControlRecursionType, includeContentMetadata?: boolean, latestProcessedChange?: boolean, download?: boolean, versionDescriptor?: GitInterfaces.GitVersionDescriptor): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Get Item Metadata and/or Content for a single item. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	    *
	    * @param {string} repositoryId
	    * @param {string} path
	    * @param {string} project - Project ID or project name
	    * @param {string} scopePath
	    * @param {GitInterfaces.VersionControlRecursionType} recursionLevel
	    * @param {boolean} includeContentMetadata
	    * @param {boolean} latestProcessedChange
	    * @param {boolean} download
	    * @param {GitInterfaces.GitVersionDescriptor} versionDescriptor
	    */
	    getItemZip(repositoryId: string, path: string, project?: string, scopePath?: string, recursionLevel?: GitInterfaces.VersionControlRecursionType, includeContentMetadata?: boolean, latestProcessedChange?: boolean, download?: boolean, versionDescriptor?: GitInterfaces.GitVersionDescriptor): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Post for retrieving a creating a batch out of a set of items in a repo / project given a list of paths or a long path
	    *
	    * @param {GitInterfaces.GitItemRequestData} requestData
	    * @param {string} repositoryId
	    * @param {string} project - Project ID or project name
	    */
	    getItemsBatch(requestData: GitInterfaces.GitItemRequestData, repositoryId: string, project?: string): Q.Promise<GitInterfaces.GitItem[][]>;
	    /**
	    * Retrieve pull request's commits
	    *
	    * @param {string} repositoryId
	    * @param {number} pullRequestId
	    * @param {string} project - Project ID or project name
	    */
	    getPullRequestCommits(repositoryId: string, pullRequestId: number, project?: string): Q.Promise<GitInterfaces.GitCommitRef[]>;
	    /**
	    * Adds a reviewer to a git pull request
	    *
	    * @param {GitInterfaces.IdentityRefWithVote} reviewer
	    * @param {string} repositoryId
	    * @param {number} pullRequestId
	    * @param {string} reviewerId
	    * @param {string} project - Project ID or project name
	    */
	    createPullRequestReviewer(reviewer: GitInterfaces.IdentityRefWithVote, repositoryId: string, pullRequestId: number, reviewerId: string, project?: string): Q.Promise<GitInterfaces.IdentityRefWithVote>;
	    /**
	    * Adds reviewers to a git pull request
	    *
	    * @param {VSSInterfaces.IdentityRef[]} reviewers
	    * @param {string} repositoryId
	    * @param {number} pullRequestId
	    * @param {string} project - Project ID or project name
	    */
	    createPullRequestReviewers(reviewers: VSSInterfaces.IdentityRef[], repositoryId: string, pullRequestId: number, project?: string): Q.Promise<GitInterfaces.IdentityRefWithVote[]>;
	    /**
	    * Adds reviewers to a git pull request
	    *
	    * @param {string} repositoryId
	    * @param {number} pullRequestId
	    * @param {string} reviewerId
	    * @param {string} project - Project ID or project name
	    */
	    deletePullRequestReviewer(repositoryId: string, pullRequestId: number, reviewerId: string, project?: string): Q.Promise<void>;
	    /**
	    * Retrieve a reviewer from a pull request
	    *
	    * @param {string} repositoryId
	    * @param {number} pullRequestId
	    * @param {string} reviewerId
	    * @param {string} project - Project ID or project name
	    */
	    getPullRequestReviewer(repositoryId: string, pullRequestId: number, reviewerId: string, project?: string): Q.Promise<GitInterfaces.IdentityRefWithVote>;
	    /**
	    * Retrieve a pull request reviewers
	    *
	    * @param {string} repositoryId
	    * @param {number} pullRequestId
	    * @param {string} project - Project ID or project name
	    */
	    getPullRequestReviewers(repositoryId: string, pullRequestId: number, project?: string): Q.Promise<GitInterfaces.IdentityRefWithVote[]>;
	    /**
	    * Query pull requests by project
	    *
	    * @param {string} project - Project ID or project name
	    * @param {GitInterfaces.GitPullRequestSearchCriteria} searchCriteria
	    * @param {number} maxCommentLength
	    * @param {number} skip
	    * @param {number} top
	    */
	    getPullRequestsByProject(project: string, searchCriteria: GitInterfaces.GitPullRequestSearchCriteria, maxCommentLength?: number, skip?: number, top?: number): Q.Promise<GitInterfaces.GitPullRequest[]>;
	    /**
	    * Create a git pull request
	    *
	    * @param {GitInterfaces.GitPullRequest} gitPullRequestToCreate
	    * @param {string} repositoryId
	    * @param {string} project - Project ID or project name
	    */
	    createPullRequest(gitPullRequestToCreate: GitInterfaces.GitPullRequest, repositoryId: string, project?: string): Q.Promise<GitInterfaces.GitPullRequest>;
	    /**
	    * Retrieve a pull request
	    *
	    * @param {string} repositoryId
	    * @param {number} pullRequestId
	    * @param {string} project - Project ID or project name
	    * @param {number} maxCommentLength
	    * @param {number} skip
	    * @param {number} top
	    * @param {boolean} includeCommits
	    */
	    getPullRequest(repositoryId: string, pullRequestId: number, project?: string, maxCommentLength?: number, skip?: number, top?: number, includeCommits?: boolean): Q.Promise<GitInterfaces.GitPullRequest>;
	    /**
	    * Query for pull requests
	    *
	    * @param {string} repositoryId
	    * @param {GitInterfaces.GitPullRequestSearchCriteria} searchCriteria
	    * @param {string} project - Project ID or project name
	    * @param {number} maxCommentLength
	    * @param {number} skip
	    * @param {number} top
	    */
	    getPullRequests(repositoryId: string, searchCriteria: GitInterfaces.GitPullRequestSearchCriteria, project?: string, maxCommentLength?: number, skip?: number, top?: number): Q.Promise<GitInterfaces.GitPullRequest[]>;
	    /**
	    * Updates a pull request
	    *
	    * @param {GitInterfaces.GitPullRequest} gitPullRequestToUpdate
	    * @param {string} repositoryId
	    * @param {number} pullRequestId
	    * @param {string} project - Project ID or project name
	    */
	    updatePullRequest(gitPullRequestToUpdate: GitInterfaces.GitPullRequest, repositoryId: string, pullRequestId: number, project?: string): Q.Promise<GitInterfaces.GitPullRequest>;
	    /**
	    * Retrieve a pull request work items
	    *
	    * @param {string} repositoryId
	    * @param {number} pullRequestId
	    * @param {string} project - Project ID or project name
	    * @param {number} commitsTop
	    * @param {number} commitsSkip
	    */
	    getPullRequestWorkItems(repositoryId: string, pullRequestId: number, project?: string, commitsTop?: number, commitsSkip?: number): Q.Promise<GitInterfaces.AssociatedWorkItem[]>;
	    /**
	    * Push changes to the repository.
	    *
	    * @param {GitInterfaces.GitPush} push
	    * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, a project-scoped route must be used.
	    * @param {string} project - Project ID or project name
	    */
	    createPush(push: GitInterfaces.GitPush, repositoryId: string, project?: string): Q.Promise<GitInterfaces.GitPush>;
	    /**
	    * Retrieve a particular push.
	    *
	    * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	    * @param {number} pushId - The id of the push.
	    * @param {string} project - Project ID or project name
	    * @param {number} includeCommits - The number of commits to include in the result.
	    * @param {boolean} includeRefUpdates
	    */
	    getPush(repositoryId: string, pushId: number, project?: string, includeCommits?: number, includeRefUpdates?: boolean): Q.Promise<GitInterfaces.GitPush>;
	    /**
	    * Retrieves pushes associated with the specified repository.
	    *
	    * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	    * @param {string} project - Project ID or project name
	    * @param {number} skip
	    * @param {number} top
	    * @param {GitInterfaces.GitPushSearchCriteria} searchCriteria
	    */
	    getPushes(repositoryId: string, project?: string, skip?: number, top?: number, searchCriteria?: GitInterfaces.GitPushSearchCriteria): Q.Promise<GitInterfaces.GitPush[]>;
	    /**
	    * Queries the provided repository for its refs and returns them.
	    *
	    * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	    * @param {string} project - Project ID or project name
	    * @param {string} filter - [optional] A filter to apply to the refs.
	    * @param {boolean} includeLinks - [optional] Specifies if referenceLinks should be included in the result. default is false.
	    */
	    getRefs(repositoryId: string, project?: string, filter?: string, includeLinks?: boolean): Q.Promise<GitInterfaces.GitRef[]>;
	    /**
	    * Creates or updates refs with the given information
	    *
	    * @param {GitInterfaces.GitRefUpdate[]} refUpdates - List of ref updates to attempt to perform
	    * @param {string} repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
	    * @param {string} project - Project ID or project name
	    * @param {string} projectId - The id of the project.
	    */
	    updateRefs(refUpdates: GitInterfaces.GitRefUpdate[], repositoryId: string, project?: string, projectId?: string): Q.Promise<GitInterfaces.GitRefUpdateResult[]>;
	    /**
	    * Create a git repository
	    *
	    * @param {GitInterfaces.GitRepository} gitRepositoryToCreate
	    * @param {string} project - Project ID or project name
	    */
	    createRepository(gitRepositoryToCreate: GitInterfaces.GitRepository, project?: string): Q.Promise<GitInterfaces.GitRepository>;
	    /**
	    * Delete a git repository
	    *
	    * @param {string} repositoryId
	    * @param {string} project - Project ID or project name
	    */
	    deleteRepository(repositoryId: string, project?: string): Q.Promise<void>;
	    /**
	    * Retrieve git repositories.
	    *
	    * @param {string} project - Project ID or project name
	    * @param {boolean} includeLinks
	    */
	    getRepositories(project?: string, includeLinks?: boolean): Q.Promise<GitInterfaces.GitRepository[]>;
	    /**
	    * @param {string} repositoryId
	    * @param {string} project - Project ID or project name
	    */
	    getRepository(repositoryId: string, project?: string): Q.Promise<GitInterfaces.GitRepository>;
	    /**
	    * Updates the Git repository with the single populated change in the specified repository information.
	    *
	    * @param {GitInterfaces.GitRepository} newRepositoryInfo
	    * @param {string} repositoryId
	    * @param {string} project - Project ID or project name
	    */
	    updateRepository(newRepositoryInfo: GitInterfaces.GitRepository, repositoryId: string, project?: string): Q.Promise<GitInterfaces.GitRepository>;
	    /**
	    * @param {GitInterfaces.GitStatus} gitCommitStatusToCreate
	    * @param {string} commitId
	    * @param {string} repositoryId
	    * @param {string} project - Project ID or project name
	    */
	    createCommitStatus(gitCommitStatusToCreate: GitInterfaces.GitStatus, commitId: string, repositoryId: string, project?: string): Q.Promise<GitInterfaces.GitStatus>;
	    /**
	    * @param {string} commitId
	    * @param {string} repositoryId
	    * @param {string} project - Project ID or project name
	    * @param {number} top
	    * @param {number} skip
	    */
	    getStatuses(commitId: string, repositoryId: string, project?: string, top?: number, skip?: number): Q.Promise<GitInterfaces.GitStatus[]>;
	    /**
	    * @param {string} repositoryId
	    * @param {string} sha1
	    * @param {string} project - Project ID or project name
	    * @param {string} projectId
	    * @param {boolean} recursive
	    * @param {string} fileName
	    */
	    getTree(repositoryId: string, sha1: string, project?: string, projectId?: string, recursive?: boolean, fileName?: string): Q.Promise<GitInterfaces.GitTreeRef>;
	    /**
	    * @param {string} repositoryId
	    * @param {string} sha1
	    * @param {string} project - Project ID or project name
	    * @param {string} projectId
	    * @param {boolean} recursive
	    * @param {string} fileName
	    */
	    getTreeZip(repositoryId: string, sha1: string, project?: string, projectId?: string, recursive?: boolean, fileName?: string): Q.Promise<NodeJS.ReadableStream>;
	}

}
declare module 'vso-node-api/interfaces/common/FormInputInterfaces' {
	export enum InputDataType {
	    /**
	     * No data type is specified.
	     */
	    None = 0,
	    /**
	     * Represents a textual value.
	     */
	    String = 10,
	    /**
	     * Represents a numberic value.
	     */
	    Number = 20,
	    /**
	     * Represents a value of true or false.
	     */
	    Boolean = 30,
	    /**
	     * Represents a Guid.
	     */
	    Guid = 40,
	    /**
	     * Represents a URI.
	     */
	    Uri = 50,
	}
	/**
	 * Describes an input for subscriptions.
	 */
	export interface InputDescriptor {
	    /**
	     * The ids of all inputs that the value of this input is dependent on.
	     */
	    dependencyInputIds: string[];
	    /**
	     * Description of what this input is used for
	     */
	    description: string;
	    /**
	     * The group localized name to which this input belongs and can be shown as a header for the container that will include all the inputs in the group.
	     */
	    groupName: string;
	    /**
	     * If true, the value information for this input is dynamic and should be fetched when the value of dependency inputs change.
	     */
	    hasDynamicValueInformation: boolean;
	    /**
	     * Identifier for the subscription input
	     */
	    id: string;
	    /**
	     * Mode in which the value of this input should be entered
	     */
	    inputMode: InputMode;
	    /**
	     * Gets whether this input is confidential, such as for a password or application key
	     */
	    isConfidential: boolean;
	    /**
	     * Localized name which can be shown as a label for the subscription input
	     */
	    name: string;
	    /**
	     * Gets whether this input is included in the default generated action description.
	     */
	    useInDefaultDescription: boolean;
	    /**
	     * Information to use to validate this input's value
	     */
	    validation: InputValidation;
	    /**
	     * A hint for input value. It can be used in the UI as the input placeholder.
	     */
	    valueHint: string;
	    /**
	     * Information about possible values for this input
	     */
	    values: InputValues;
	}
	/**
	 * Defines a filter for subscription inputs. The filter matches a set of inputs if any (one or more) of the groups evaluates to true.
	 */
	export interface InputFilter {
	    /**
	     * Groups of input filter expressions. This filter matches a set of inputs if any (one or more) of the groups evaluates to true.
	     */
	    conditions: InputFilterCondition[];
	}
	/**
	 * An expression which can be applied to filter a list of subscription inputs
	 */
	export interface InputFilterCondition {
	    /**
	     * Whether or not to do a case sensitive match
	     */
	    caseSensitive: boolean;
	    /**
	     * The Id of the input to filter on
	     */
	    inputId: string;
	    /**
	     * The "expected" input value to compare with the actual input value
	     */
	    inputValue: string;
	    /**
	     * The operator applied between the expected and actual input value
	     */
	    operator: InputFilterOperator;
	}
	export enum InputFilterOperator {
	    Equals = 0,
	    NotEquals = 1,
	}
	export enum InputMode {
	    /**
	     * This input should not be shown in the UI
	     */
	    None = 0,
	    /**
	     * An input text box should be shown
	     */
	    TextBox = 10,
	    /**
	     * An password input box should be shown
	     */
	    PasswordBox = 20,
	    /**
	     * A select/combo control should be shown
	     */
	    Combo = 30,
	    /**
	     * Radio buttons should be shown
	     */
	    RadioButtons = 40,
	    /**
	     * Checkbox should be shown(for true/false values)
	     */
	    CheckBox = 50,
	    /**
	     * A multi-line text area should be shown
	     */
	    TextArea = 60,
	}
	/**
	 * Describes what values are valid for a subscription input
	 */
	export interface InputValidation {
	    dataType: InputDataType;
	    isRequired: boolean;
	    maxLength: number;
	    maxValue: number;
	    minLength: number;
	    minValue: number;
	    pattern: string;
	    patternMismatchErrorMessage: string;
	}
	/**
	 * Information about a single value for an input
	 */
	export interface InputValue {
	    /**
	     * Any other data about this input
	     */
	    data: {
	        [key: string]: any;
	    };
	    /**
	     * The text to show for the display of this value
	     */
	    displayValue: string;
	    /**
	     * The value to store for this input
	     */
	    value: string;
	}
	/**
	 * Information about the possible/allowed values for a given subscription input
	 */
	export interface InputValues {
	    /**
	     * The default value to use for this input
	     */
	    defaultValue: string;
	    /**
	     * Errors encountered while computing dynamic values.
	     */
	    error: InputValuesError;
	    /**
	     * The id of the input
	     */
	    inputId: string;
	    /**
	     * Should this input be disabled
	     */
	    isDisabled: boolean;
	    /**
	     * Should the value be restricted to one of the values in the PossibleValues (True) or are the values in PossibleValues just a suggestion (False)
	     */
	    isLimitedToPossibleValues: boolean;
	    /**
	     * Should this input be made read-only
	     */
	    isReadOnly: boolean;
	    /**
	     * Possible values that this input can take
	     */
	    possibleValues: InputValue[];
	}
	/**
	 * Error information related to a subscription input value.
	 */
	export interface InputValuesError {
	    /**
	     * The error message.
	     */
	    message: string;
	}
	export interface InputValuesQuery {
	    currentValues: {
	        [key: string]: string;
	    };
	    /**
	     * The input values to return on input, and the result from the consumer on output.
	     */
	    inputValues: InputValues[];
	    /**
	     * Subscription containing information about the publisher/consumer and the current input values
	     */
	    resource: any;
	}
	export var TypeInfo: {
	    InputDataType: {
	        enumValues: {
	            "none": number;
	            "string": number;
	            "number": number;
	            "boolean": number;
	            "guid": number;
	            "uri": number;
	        };
	    };
	    InputDescriptor: {
	        fields: any;
	    };
	    InputFilter: {
	        fields: any;
	    };
	    InputFilterCondition: {
	        fields: any;
	    };
	    InputFilterOperator: {
	        enumValues: {
	            "equals": number;
	            "notEquals": number;
	        };
	    };
	    InputMode: {
	        enumValues: {
	            "none": number;
	            "textBox": number;
	            "passwordBox": number;
	            "combo": number;
	            "radioButtons": number;
	            "checkBox": number;
	            "textArea": number;
	        };
	    };
	    InputValidation: {
	        fields: any;
	    };
	    InputValue: {
	        fields: any;
	    };
	    InputValues: {
	        fields: any;
	    };
	    InputValuesError: {
	        fields: any;
	    };
	    InputValuesQuery: {
	        fields: any;
	    };
	};

}
declare module 'vso-node-api/interfaces/TaskAgentInterfaces' {
	import FormInputInterfaces = require('vso-node-api/interfaces/common/FormInputInterfaces');
	import VSSInterfaces = require('vso-node-api/interfaces/common/VSSInterfaces');
	export interface AgentPoolEvent {
	    eventType: string;
	    pool: TaskAgentPool;
	}
	export interface AgentQueueEvent {
	    eventType: string;
	    queue: TaskAgentQueue;
	}
	export interface AgentRefreshMessage {
	    agentId: number;
	    timeout: any;
	}
	export interface AuthorizationHeader {
	    name: string;
	    value: string;
	}
	export enum ConnectedServiceKind {
	    /**
	     * Custom or unknown service
	     */
	    Custom = 0,
	    /**
	     * Azure Subscription
	     */
	    AzureSubscription = 1,
	    /**
	     * Chef Connection
	     */
	    Chef = 2,
	    /**
	     * Generic Connection
	     */
	    Generic = 3,
	    /**
	     * GitHub Connection
	     */
	    GitHub = 4,
	}
	export interface DataSource {
	    endpointUrl: string;
	    name: string;
	    resultSelector: string;
	}
	export interface DataSourceBinding {
	    dataSourceName: string;
	    endpointId: string;
	    parameters: {
	        [key: string]: string;
	    };
	    resultTemplate: string;
	    target: string;
	}
	export interface EndpointAuthorization {
	    parameters: {
	        [key: string]: string;
	    };
	    scheme: string;
	}
	export interface EndpointUrl {
	    displayName: string;
	    helpText: string;
	    value: string;
	}
	export interface HelpLink {
	    text: string;
	    url: string;
	}
	export interface Issue {
	    category: string;
	    data: {
	        [key: string]: string;
	    };
	    message: string;
	    type: IssueType;
	}
	export enum IssueType {
	    Error = 1,
	    Warning = 2,
	}
	export interface JobAssignedEvent extends JobEvent {
	    request: TaskAgentJobRequest;
	}
	export interface JobCancelMessage {
	    jobId: string;
	    timeout: any;
	}
	export interface JobCompletedEvent extends JobEvent {
	    requestId: number;
	    result: TaskResult;
	}
	/**
	 * Represents the context of variables and vectors for a job request.
	 */
	export interface JobEnvironment {
	    endpoints: ServiceEndpoint[];
	    mask: MaskHint[];
	    options: {
	        [key: string]: JobOption;
	    };
	    /**
	     * Gets or sets the endpoint used for communicating back to the calling service.
	     */
	    systemConnection: ServiceEndpoint;
	    variables: {
	        [key: string]: string;
	    };
	}
	export interface JobEvent {
	    jobId: string;
	    name: string;
	}
	/**
	 * Represents an option that may affect the way an agent runs the job.
	 */
	export interface JobOption {
	    data: {
	        [key: string]: string;
	    };
	    /**
	     * Gets the id of the option.
	     */
	    id: string;
	}
	export interface JobRequestMessage {
	    environment: JobEnvironment;
	    jobId: string;
	    jobName: string;
	    lockedUntil: Date;
	    lockToken: string;
	    plan: TaskOrchestrationPlanReference;
	    requestId: number;
	    tasks: TaskInstance[];
	    timeline: TimelineReference;
	}
	export interface MaskHint {
	    type: MaskType;
	    value: string;
	}
	export enum MaskType {
	    Variable = 1,
	    Regex = 2,
	}
	export interface PlanEnvironment {
	    mask: MaskHint[];
	    options: {
	        [key: string]: JobOption;
	    };
	    variables: {
	        [key: string]: string;
	    };
	}
	/**
	 * Represents an endpoint which may be used by an orchestration job.
	 */
	export interface ServiceEndpoint {
	    administratorsGroup: VSSInterfaces.IdentityRef;
	    /**
	     * Gets or sets the authorization data for talking to the endpoint.
	     */
	    authorization: EndpointAuthorization;
	    /**
	     * The Gets or sets Identity reference for the user who created the Service endpoint
	     */
	    createdBy: VSSInterfaces.IdentityRef;
	    data: {
	        [key: string]: string;
	    };
	    /**
	     * Gets or Sets description of endpoint
	     */
	    description: string;
	    groupScopeId: string;
	    /**
	     * Gets or sets the identifier of this endpoint.
	     */
	    id: string;
	    /**
	     * Gets or sets the friendly name of the endpoint.
	     */
	    name: string;
	    readersGroup: VSSInterfaces.IdentityRef;
	    /**
	     * Gets or sets the type of the endpoint.
	     */
	    type: string;
	    /**
	     * Gets or sets the url of the endpoint.
	     */
	    url: string;
	}
	export interface ServiceEndpointAuthenticationScheme {
	    authorizationHeaders: AuthorizationHeader[];
	    displayName: string;
	    endpointHeaders: AuthorizationHeader[];
	    inputDescriptors: FormInputInterfaces.InputDescriptor[];
	    scheme: string;
	}
	export interface ServiceEndpointType {
	    authenticationSchemes: ServiceEndpointAuthenticationScheme[];
	    dataSources: DataSource[];
	    description: string;
	    displayName: string;
	    endpointUrl: EndpointUrl;
	    helpLink: HelpLink;
	    helpMarkDown: string;
	    name: string;
	}
	export interface TaskAgent extends TaskAgentReference {
	    /**
	     * Gets the request which is currently assigned to this agent.
	     */
	    assignedRequest: TaskAgentJobRequest;
	    /**
	     * Gets the date on which this agent was created.
	     */
	    createdOn: Date;
	    /**
	     * Gets or sets the maximum job parallelism allowed on this host.
	     */
	    maxParallelism: number;
	    properties: any;
	    /**
	     * Gets the date on which the last connectivity status change occurred.
	     */
	    statusChangedOn: Date;
	    systemCapabilities: {
	        [key: string]: string;
	    };
	    userCapabilities: {
	        [key: string]: string;
	    };
	}
	export interface TaskAgentJobRequest {
	    assignTime: Date;
	    definition: TaskOrchestrationOwner;
	    demands: any[];
	    finishTime: Date;
	    hostId: string;
	    jobId: string;
	    lockedUntil: Date;
	    matchedAgents: TaskAgentReference[];
	    owner: TaskOrchestrationOwner;
	    planId: string;
	    planType: string;
	    queueTime: Date;
	    receiveTime: Date;
	    requestId: number;
	    reservedAgent: TaskAgentReference;
	    result: TaskResult;
	    scopeId: string;
	    serviceOwner: string;
	}
	export interface TaskAgentMessage {
	    body: string;
	    messageId: number;
	    messageType: string;
	}
	export interface TaskAgentPool extends TaskAgentPoolReference {
	    /**
	     * Gets the administrators group for this agent pool.
	     */
	    administratorsGroup: VSSInterfaces.IdentityRef;
	    /**
	     * Gets or sets a value indicating whether or not a queue should be automatically provisioned for each project collection or not.
	     */
	    autoProvision: boolean;
	    /**
	     * Gets the identity who created this pool. The creator of the pool is automatically added into the administrators group for the pool on creation.
	     */
	    createdBy: VSSInterfaces.IdentityRef;
	    /**
	     * Gets the date/time of the pool creation.
	     */
	    createdOn: Date;
	    /**
	     * Gets the scope identifier for groups/roles which are owned by this pool.
	     */
	    groupScopeId: string;
	    /**
	     * Gets or sets a value indicating whether or not this pool is managed by the service.
	     */
	    isHosted: boolean;
	    properties: any;
	    /**
	     * Gets a value indicating whether or not roles have been provisioned for this pool.
	     */
	    provisioned: boolean;
	    /**
	     * Gets the service accounts group for this agent pool.
	     */
	    serviceAccountsGroup: VSSInterfaces.IdentityRef;
	    /**
	     * Gets the current size of the pool.
	     */
	    size: number;
	}
	export interface TaskAgentPoolReference {
	    id: number;
	    name: string;
	    scope: string;
	}
	export interface TaskAgentQueue {
	    groupScopeId: string;
	    id: number;
	    name: string;
	    pool: TaskAgentPoolReference;
	    provisioned: boolean;
	}
	export enum TaskAgentQueueActionFilter {
	    None = 0,
	    Manage = 2,
	    Use = 16,
	}
	export interface TaskAgentReference {
	    _links: any;
	    /**
	     * Gets or sets a value indicating whether or not this agent should be enabled for job execution.
	     */
	    enabled: boolean;
	    /**
	     * Gets the identifier of the agent.
	     */
	    id: number;
	    /**
	     * Gets the name of the agent.
	     */
	    name: string;
	    /**
	     * Gets the current connectivity status of the agent.
	     */
	    status: TaskAgentStatus;
	    /**
	     * Gets the version of the agent.
	     */
	    version: string;
	}
	export interface TaskAgentSession {
	    agent: TaskAgentReference;
	    ownerName: string;
	    sessionId: string;
	    systemCapabilities: {
	        [key: string]: string;
	    };
	}
	export enum TaskAgentStatus {
	    Offline = 1,
	    Online = 2,
	}
	export interface TaskAttachment {
	    _links: any;
	    createdOn: Date;
	    lastChangedBy: string;
	    lastChangedOn: Date;
	    name: string;
	    recordId: string;
	    timelineId: string;
	    type: string;
	}
	export interface TaskChangeEvent {
	}
	export interface TaskDefinition {
	    agentExecution: TaskExecution;
	    author: string;
	    category: string;
	    contentsUploaded: boolean;
	    contributionIdentifier: string;
	    contributionVersion: string;
	    dataSourceBindings: DataSourceBinding[];
	    demands: any[];
	    description: string;
	    disabled: boolean;
	    friendlyName: string;
	    groups: TaskGroupDefinition[];
	    helpMarkDown: string;
	    hostType: string;
	    iconUrl: string;
	    id: string;
	    inputs: TaskInputDefinition[];
	    instanceNameFormat: string;
	    minimumAgentVersion: string;
	    name: string;
	    packageLocation: string;
	    packageType: string;
	    serverOwned: boolean;
	    sourceDefinitions: TaskSourceDefinition[];
	    sourceLocation: string;
	    version: TaskVersion;
	    visibility: string[];
	}
	export interface TaskDefinitionEndpoint {
	    /**
	     * An ID that identifies a service connection to be used for authenticating endpoint requests.
	     */
	    connectionId: string;
	    /**
	     * An Json based keyselector to filter response returned by fetching the endpoint Url.A Json based keyselector must be prefixed with "jsonpath:". KeySelector can be used to specify the filter to get the keys for the values specified with Selector.  The following keyselector defines an Json for extracting nodes named 'ServiceName'.  endpoint.KeySelector = "jsonpath://ServiceName";
	     */
	    keySelector: string;
	    /**
	     * The scope as understood by Connected Services. Essentialy, a project-id for now.
	     */
	    scope: string;
	    /**
	     * An XPath/Json based selector to filter response returned by fetching the endpoint Url. An XPath based selector must be prefixed with the string "xpath:". A Json based selector must be prefixed with "jsonpath:".  The following selector defines an XPath for extracting nodes named 'ServiceName'.  endpoint.Selector = "xpath://ServiceName";
	     */
	    selector: string;
	    /**
	     * TaskId that this endpoint belongs to.
	     */
	    taskId: string;
	    /**
	     * URL to GET.
	     */
	    url: string;
	}
	export interface TaskExecution {
	    /**
	     * The utility task to run.  Specifying this means that this task definition is simply a meta task to call another task. This is useful for tasks that call utility tasks like powershell and commandline
	     */
	    execTask: TaskReference;
	    /**
	     * If a task is going to run code, then this provides the type/script etc... information by platform. For example, it might look like. net45: { typeName: "Microsoft.TeamFoundation.Automation.Tasks.PowerShellTask", assemblyName: "Microsoft.TeamFoundation.Automation.Tasks.PowerShell.dll" } net20: { typeName: "Microsoft.TeamFoundation.Automation.Tasks.PowerShellTask", assemblyName: "Microsoft.TeamFoundation.Automation.Tasks.PowerShell.dll" } java: { jar: "powershelltask.tasks.automation.teamfoundation.microsoft.com", } node: { script: "powershellhost.js", }
	     */
	    platformInstructions: {
	        [key: string]: {
	            [key: string]: string;
	        };
	    };
	}
	export interface TaskGroupDefinition {
	    displayName: string;
	    isExpanded: boolean;
	    name: string;
	    tags: string[];
	}
	export interface TaskInputDefinition {
	    defaultValue: string;
	    groupName: string;
	    helpMarkDown: string;
	    label: string;
	    name: string;
	    options: {
	        [key: string]: string;
	    };
	    properties: {
	        [key: string]: string;
	    };
	    required: boolean;
	    type: string;
	    visibleRule: string;
	}
	export interface TaskInstance extends TaskReference {
	    alwaysRun: boolean;
	    continueOnError: boolean;
	    displayName: string;
	    enabled: boolean;
	    instanceId: string;
	}
	export interface TaskLog extends TaskLogReference {
	    createdOn: Date;
	    indexLocation: string;
	    lastChangedOn: Date;
	    lineCount: number;
	    path: string;
	}
	export interface TaskLogReference {
	    id: number;
	    location: string;
	}
	export interface TaskOrchestrationContainer extends TaskOrchestrationItem {
	    children: TaskOrchestrationItem[];
	    continueOnError: boolean;
	    parallel: boolean;
	    rollback: TaskOrchestrationContainer;
	}
	export interface TaskOrchestrationItem {
	    itemType: TaskOrchestrationItemType;
	}
	export enum TaskOrchestrationItemType {
	    Container = 0,
	    Job = 1,
	}
	export interface TaskOrchestrationJob extends TaskOrchestrationItem {
	    demands: any[];
	    executeAs: VSSInterfaces.IdentityRef;
	    executionTimeout: any;
	    instanceId: string;
	    name: string;
	    tasks: TaskInstance[];
	    variables: {
	        [key: string]: string;
	    };
	}
	export interface TaskOrchestrationOwner {
	    _links: any;
	    id: number;
	    name: string;
	}
	export interface TaskOrchestrationPlan extends TaskOrchestrationPlanReference {
	    environment: PlanEnvironment;
	    finishTime: Date;
	    implementation: TaskOrchestrationContainer;
	    requestedById: string;
	    requestedForId: string;
	    result: TaskResult;
	    resultCode: string;
	    startTime: Date;
	    state: TaskOrchestrationPlanState;
	    timeline: TimelineReference;
	}
	export interface TaskOrchestrationPlanReference {
	    artifactLocation: string;
	    artifactUri: string;
	    planId: string;
	    planType: string;
	    scopeIdentifier: string;
	    version: number;
	}
	export enum TaskOrchestrationPlanState {
	    InProgress = 1,
	    Queued = 2,
	    Completed = 4,
	}
	export interface TaskPackageMetadata {
	    /**
	     * Gets the name of the package.
	     */
	    type: string;
	    /**
	     * Gets the url of the package.
	     */
	    url: string;
	    /**
	     * Gets the version of the package.
	     */
	    version: string;
	}
	export interface TaskReference {
	    id: string;
	    inputs: {
	        [key: string]: string;
	    };
	    name: string;
	    version: string;
	}
	export enum TaskResult {
	    Succeeded = 0,
	    SucceededWithIssues = 1,
	    Failed = 2,
	    Canceled = 3,
	    Skipped = 4,
	    Abandoned = 5,
	}
	export interface TaskSourceDefinition {
	    authKey: string;
	    endpoint: string;
	    keySelector: string;
	    selector: string;
	    target: string;
	}
	export interface TaskVersion {
	    isTest: boolean;
	    major: number;
	    minor: number;
	    patch: number;
	}
	/**
	 * Represents a shallow reference to a TeamProject.
	 */
	export interface TeamProjectReference {
	    /**
	     * Project abbreviation.
	     */
	    abbreviation: string;
	    /**
	     * The project's description (if any).
	     */
	    description: string;
	    /**
	     * Project identifier.
	     */
	    id: string;
	    /**
	     * Project name.
	     */
	    name: string;
	    /**
	     * Project state.
	     */
	    state: any;
	    /**
	     * Url to the full version of the object.
	     */
	    url: string;
	}
	export interface Timeline extends TimelineReference {
	    lastChangedBy: string;
	    lastChangedOn: Date;
	    records: TimelineRecord[];
	}
	export interface TimelineRecord {
	    changeId: number;
	    currentOperation: string;
	    details: TimelineReference;
	    errorCount: number;
	    finishTime: Date;
	    id: string;
	    issues: Issue[];
	    lastModified: Date;
	    location: string;
	    log: TaskLogReference;
	    name: string;
	    order: number;
	    parentId: string;
	    percentComplete: number;
	    result: TaskResult;
	    resultCode: string;
	    startTime: Date;
	    state: TimelineRecordState;
	    type: string;
	    warningCount: number;
	    workerName: string;
	}
	export enum TimelineRecordState {
	    Pending = 0,
	    InProgress = 1,
	    Completed = 2,
	}
	export interface TimelineReference {
	    changeId: number;
	    id: string;
	    location: string;
	}
	export interface WebApiConnectedService extends WebApiConnectedServiceRef {
	    /**
	     * The user who did the OAuth authentication to created this service
	     */
	    authenticatedBy: VSSInterfaces.IdentityRef;
	    /**
	     * Extra description on the service.
	     */
	    description: string;
	    /**
	     * Friendly Name of service connection
	     */
	    friendlyName: string;
	    /**
	     * Id/Name of the connection service. For Ex: Subscription Id for Azure Connection
	     */
	    id: string;
	    /**
	     * The kind of service.
	     */
	    kind: string;
	    /**
	     * The project associated with this service
	     */
	    project: TeamProjectReference;
	    /**
	     * Optional uri to connect directly to the service such as https://windows.azure.com
	     */
	    serviceUri: string;
	}
	export interface WebApiConnectedServiceDetails extends WebApiConnectedServiceRef {
	    /**
	     * Meta data for service connection
	     */
	    connectedServiceMetaData: WebApiConnectedService;
	    /**
	     * Credential info
	     */
	    credentialsXml: string;
	    /**
	     * Optional uri to connect directly to the service such as https://windows.azure.com
	     */
	    endPoint: string;
	}
	export interface WebApiConnectedServiceRef {
	    id: string;
	    url: string;
	}
	export var TypeInfo: {
	    AgentPoolEvent: {
	        fields: any;
	    };
	    AgentQueueEvent: {
	        fields: any;
	    };
	    AgentRefreshMessage: {
	        fields: any;
	    };
	    AuthorizationHeader: {
	        fields: any;
	    };
	    ConnectedServiceKind: {
	        enumValues: {
	            "custom": number;
	            "azureSubscription": number;
	            "chef": number;
	            "generic": number;
	            "gitHub": number;
	        };
	    };
	    DataSource: {
	        fields: any;
	    };
	    DataSourceBinding: {
	        fields: any;
	    };
	    EndpointAuthorization: {
	        fields: any;
	    };
	    EndpointUrl: {
	        fields: any;
	    };
	    HelpLink: {
	        fields: any;
	    };
	    Issue: {
	        fields: any;
	    };
	    IssueType: {
	        enumValues: {
	            "error": number;
	            "warning": number;
	        };
	    };
	    JobAssignedEvent: {
	        fields: any;
	    };
	    JobCancelMessage: {
	        fields: any;
	    };
	    JobCompletedEvent: {
	        fields: any;
	    };
	    JobEnvironment: {
	        fields: any;
	    };
	    JobEvent: {
	        fields: any;
	    };
	    JobOption: {
	        fields: any;
	    };
	    JobRequestMessage: {
	        fields: any;
	    };
	    MaskHint: {
	        fields: any;
	    };
	    MaskType: {
	        enumValues: {
	            "variable": number;
	            "regex": number;
	        };
	    };
	    PlanEnvironment: {
	        fields: any;
	    };
	    ServiceEndpoint: {
	        fields: any;
	    };
	    ServiceEndpointAuthenticationScheme: {
	        fields: any;
	    };
	    ServiceEndpointType: {
	        fields: any;
	    };
	    TaskAgent: {
	        fields: any;
	    };
	    TaskAgentJobRequest: {
	        fields: any;
	    };
	    TaskAgentMessage: {
	        fields: any;
	    };
	    TaskAgentPool: {
	        fields: any;
	    };
	    TaskAgentPoolReference: {
	        fields: any;
	    };
	    TaskAgentQueue: {
	        fields: any;
	    };
	    TaskAgentQueueActionFilter: {
	        enumValues: {
	            "none": number;
	            "manage": number;
	            "use": number;
	        };
	    };
	    TaskAgentReference: {
	        fields: any;
	    };
	    TaskAgentSession: {
	        fields: any;
	    };
	    TaskAgentStatus: {
	        enumValues: {
	            "offline": number;
	            "online": number;
	        };
	    };
	    TaskAttachment: {
	        fields: any;
	    };
	    TaskChangeEvent: {
	        fields: any;
	    };
	    TaskDefinition: {
	        fields: any;
	    };
	    TaskDefinitionEndpoint: {
	        fields: any;
	    };
	    TaskExecution: {
	        fields: any;
	    };
	    TaskGroupDefinition: {
	        fields: any;
	    };
	    TaskInputDefinition: {
	        fields: any;
	    };
	    TaskInstance: {
	        fields: any;
	    };
	    TaskLog: {
	        fields: any;
	    };
	    TaskLogReference: {
	        fields: any;
	    };
	    TaskOrchestrationContainer: {
	        fields: any;
	    };
	    TaskOrchestrationItem: {
	        fields: any;
	    };
	    TaskOrchestrationItemType: {
	        enumValues: {
	            "container": number;
	            "job": number;
	        };
	    };
	    TaskOrchestrationJob: {
	        fields: any;
	    };
	    TaskOrchestrationOwner: {
	        fields: any;
	    };
	    TaskOrchestrationPlan: {
	        fields: any;
	    };
	    TaskOrchestrationPlanReference: {
	        fields: any;
	    };
	    TaskOrchestrationPlanState: {
	        enumValues: {
	            "inProgress": number;
	            "queued": number;
	            "completed": number;
	        };
	    };
	    TaskPackageMetadata: {
	        fields: any;
	    };
	    TaskReference: {
	        fields: any;
	    };
	    TaskResult: {
	        enumValues: {
	            "succeeded": number;
	            "succeededWithIssues": number;
	            "failed": number;
	            "canceled": number;
	            "skipped": number;
	            "abandoned": number;
	        };
	    };
	    TaskSourceDefinition: {
	        fields: any;
	    };
	    TaskVersion: {
	        fields: any;
	    };
	    TeamProjectReference: {
	        fields: any;
	    };
	    Timeline: {
	        fields: any;
	    };
	    TimelineRecord: {
	        fields: any;
	    };
	    TimelineRecordState: {
	        enumValues: {
	            "pending": number;
	            "inProgress": number;
	            "completed": number;
	        };
	    };
	    TimelineReference: {
	        fields: any;
	    };
	    WebApiConnectedService: {
	        fields: any;
	    };
	    WebApiConnectedServiceDetails: {
	        fields: any;
	    };
	    WebApiConnectedServiceRef: {
	        fields: any;
	    };
	};

}
declare module 'vso-node-api/TaskAgentApiBase' {
	/// <reference path="../node/node.d.ts" />
	/// <reference path="../q/Q.d.ts" />
	import Q = require('q');
	import basem = require('vso-node-api/ClientApiBases');
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	import TaskAgentInterfaces = require('vso-node-api/interfaces/TaskAgentInterfaces');
	import VSSInterfaces = require('vso-node-api/interfaces/common/VSSInterfaces');
	export interface ITaskAgentApiBase extends basem.ClientApiBase {
	    addAgent(agent: TaskAgentInterfaces.TaskAgent, poolId: number, onResult: (err: any, statusCode: number, agent: TaskAgentInterfaces.TaskAgent) => void): void;
	    deleteAgent(poolId: number, agentId: number, onResult: (err: any, statusCode: number) => void): void;
	    getAgent(poolId: number, agentId: number, includeCapabilities: boolean, includeAssignedRequest: boolean, propertyFilters: string[], onResult: (err: any, statusCode: number, agent: TaskAgentInterfaces.TaskAgent) => void): void;
	    getAgents(poolId: number, agentName: string, includeCapabilities: boolean, includeAssignedRequest: boolean, propertyFilters: string[], demands: string[], onResult: (err: any, statusCode: number, agents: TaskAgentInterfaces.TaskAgent[]) => void): void;
	    replaceAgent(agent: TaskAgentInterfaces.TaskAgent, poolId: number, agentId: number, onResult: (err: any, statusCode: number, agent: TaskAgentInterfaces.TaskAgent) => void): void;
	    updateAgent(agent: TaskAgentInterfaces.TaskAgent, poolId: number, agentId: number, onResult: (err: any, statusCode: number, agent: TaskAgentInterfaces.TaskAgent) => void): void;
	    queryEndpoint(endpoint: TaskAgentInterfaces.TaskDefinitionEndpoint, onResult: (err: any, statusCode: number, endpoint: string[]) => void): void;
	    deleteAgentRequest(poolId: number, requestId: number, lockToken: string, onResult: (err: any, statusCode: number) => void): void;
	    getAgentRequest(poolId: number, requestId: number, onResult: (err: any, statusCode: number, jobrequest: TaskAgentInterfaces.TaskAgentJobRequest) => void): void;
	    getAgentRequestsForAgent(poolId: number, agentId: number, completedRequestCount: number, onResult: (err: any, statusCode: number, jobrequests: TaskAgentInterfaces.TaskAgentJobRequest[]) => void): void;
	    getAgentRequestsForAgents(poolId: number, agentIds: number[], completedRequestCount: number, onResult: (err: any, statusCode: number, jobrequests: TaskAgentInterfaces.TaskAgentJobRequest[]) => void): void;
	    getAgentRequestsForPlan(poolId: number, planId: string, jobId: string, onResult: (err: any, statusCode: number, jobrequests: TaskAgentInterfaces.TaskAgentJobRequest[]) => void): void;
	    queueAgentRequest(request: TaskAgentInterfaces.TaskAgentJobRequest, poolId: number, onResult: (err: any, statusCode: number, jobrequest: TaskAgentInterfaces.TaskAgentJobRequest) => void): void;
	    updateAgentRequest(request: TaskAgentInterfaces.TaskAgentJobRequest, poolId: number, requestId: number, lockToken: string, onResult: (err: any, statusCode: number, jobrequest: TaskAgentInterfaces.TaskAgentJobRequest) => void): void;
	    deleteMessage(poolId: number, messageId: number, sessionId: string, onResult: (err: any, statusCode: number) => void): void;
	    getMessage(poolId: number, sessionId: string, lastMessageId: number, onResult: (err: any, statusCode: number, message: TaskAgentInterfaces.TaskAgentMessage) => void): void;
	    refreshAgent(poolId: number, agentId: number, onResult: (err: any, statusCode: number) => void): void;
	    refreshAgents(poolId: number, onResult: (err: any, statusCode: number) => void): void;
	    sendMessage(message: TaskAgentInterfaces.TaskAgentMessage, poolId: number, requestId: number, onResult: (err: any, statusCode: number) => void): void;
	    getPackage(packageType: string, onResult: (err: any, statusCode: number, _package: TaskAgentInterfaces.TaskPackageMetadata) => void): void;
	    getPackages(onResult: (err: any, statusCode: number, packages: TaskAgentInterfaces.TaskPackageMetadata[]) => void): void;
	    getPackageZip(packageType: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getAgentPoolRoles(poolId: number, onResult: (err: any, statusCode: number, poolroles: VSSInterfaces.IdentityRef[]) => void): void;
	    addAgentPool(pool: TaskAgentInterfaces.TaskAgentPool, onResult: (err: any, statusCode: number, pool: TaskAgentInterfaces.TaskAgentPool) => void): void;
	    deleteAgentPool(poolId: number, onResult: (err: any, statusCode: number) => void): void;
	    getAgentPool(poolId: number, properties: string[], onResult: (err: any, statusCode: number, pool: TaskAgentInterfaces.TaskAgentPool) => void): void;
	    getAgentPools(poolName: string, properties: string[], onResult: (err: any, statusCode: number, pools: TaskAgentInterfaces.TaskAgentPool[]) => void): void;
	    updateAgentPool(pool: TaskAgentInterfaces.TaskAgentPool, poolId: number, onResult: (err: any, statusCode: number, pool: TaskAgentInterfaces.TaskAgentPool) => void): void;
	    getAgentQueueRoles(queueId: number, onResult: (err: any, statusCode: number, queueroles: VSSInterfaces.IdentityRef[]) => void): void;
	    addAgentQueue(queue: TaskAgentInterfaces.TaskAgentQueue, onResult: (err: any, statusCode: number, queue: TaskAgentInterfaces.TaskAgentQueue) => void): void;
	    deleteAgentQueue(queueId: number, onResult: (err: any, statusCode: number) => void): void;
	    getAgentQueue(queueId: number, actionFilter: TaskAgentInterfaces.TaskAgentQueueActionFilter, onResult: (err: any, statusCode: number, queue: TaskAgentInterfaces.TaskAgentQueue) => void): void;
	    getAgentQueues(queueName: string, actionFilter: TaskAgentInterfaces.TaskAgentQueueActionFilter, onResult: (err: any, statusCode: number, queues: TaskAgentInterfaces.TaskAgentQueue[]) => void): void;
	    queryServiceEndpoint(binding: TaskAgentInterfaces.DataSourceBinding, scopeIdentifier: string, onResult: (err: any, statusCode: number, serviceendpointproxy: string[]) => void): void;
	    createServiceEndpoint(endpoint: TaskAgentInterfaces.ServiceEndpoint, scopeIdentifier: string, onResult: (err: any, statusCode: number, serviceendpoint: TaskAgentInterfaces.ServiceEndpoint) => void): void;
	    deleteServiceEndpoint(scopeIdentifier: string, endpointId: string, onResult: (err: any, statusCode: number) => void): void;
	    getServiceEndpointDetails(scopeIdentifier: string, endpointId: string, onResult: (err: any, statusCode: number, serviceendpoint: TaskAgentInterfaces.ServiceEndpoint) => void): void;
	    getServiceEndpoints(scopeIdentifier: string, type: string, authSchemes: string[], endpointIds: string[], onResult: (err: any, statusCode: number, serviceendpoints: TaskAgentInterfaces.ServiceEndpoint[]) => void): void;
	    updateServiceEndpoint(endpoint: TaskAgentInterfaces.ServiceEndpoint, scopeIdentifier: string, endpointId: string, onResult: (err: any, statusCode: number, serviceendpoint: TaskAgentInterfaces.ServiceEndpoint) => void): void;
	    getServiceEndpointTypes(scopeIdentifier: string, type: string, scheme: string, onResult: (err: any, statusCode: number, serviceendpointtypes: TaskAgentInterfaces.ServiceEndpointType[]) => void): void;
	    createAgentSession(session: TaskAgentInterfaces.TaskAgentSession, poolId: number, onResult: (err: any, statusCode: number, session: TaskAgentInterfaces.TaskAgentSession) => void): void;
	    deleteAgentSession(poolId: number, sessionId: string, onResult: (err: any, statusCode: number) => void): void;
	    deleteTaskDefinition(taskId: string, onResult: (err: any, statusCode: number) => void): void;
	    getTaskContentZip(taskId: string, versionString: string, visibility: string[], scopeLocal: boolean, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getTaskDefinition(taskId: string, versionString: string, visibility: string[], scopeLocal: boolean, onResult: (err: any, statusCode: number, task: TaskAgentInterfaces.TaskDefinition) => void): void;
	    getTaskDefinitions(taskId: string, visibility: string[], scopeLocal: boolean, onResult: (err: any, statusCode: number, tasks: TaskAgentInterfaces.TaskDefinition[]) => void): void;
	    updateAgentUserCapabilities(userCapabilities: {
	        [key: string]: string;
	    }, poolId: number, agentId: number, onResult: (err: any, statusCode: number, usercapabilitie: TaskAgentInterfaces.TaskAgent) => void): void;
	}
	export interface IQTaskAgentApiBase extends basem.QClientApiBase {
	    addAgent(agent: TaskAgentInterfaces.TaskAgent, poolId: number): Q.Promise<TaskAgentInterfaces.TaskAgent>;
	    deleteAgent(poolId: number, agentId: number): Q.Promise<void>;
	    getAgent(poolId: number, agentId: number, includeCapabilities?: boolean, includeAssignedRequest?: boolean, propertyFilters?: string[]): Q.Promise<TaskAgentInterfaces.TaskAgent>;
	    getAgents(poolId: number, agentName?: string, includeCapabilities?: boolean, includeAssignedRequest?: boolean, propertyFilters?: string[], demands?: string[]): Q.Promise<TaskAgentInterfaces.TaskAgent[]>;
	    replaceAgent(agent: TaskAgentInterfaces.TaskAgent, poolId: number, agentId: number): Q.Promise<TaskAgentInterfaces.TaskAgent>;
	    updateAgent(agent: TaskAgentInterfaces.TaskAgent, poolId: number, agentId: number): Q.Promise<TaskAgentInterfaces.TaskAgent>;
	    queryEndpoint(endpoint: TaskAgentInterfaces.TaskDefinitionEndpoint): Q.Promise<string[]>;
	    deleteAgentRequest(poolId: number, requestId: number, lockToken: string): Q.Promise<void>;
	    getAgentRequest(poolId: number, requestId: number): Q.Promise<TaskAgentInterfaces.TaskAgentJobRequest>;
	    getAgentRequestsForAgent(poolId: number, agentId: number, completedRequestCount?: number): Q.Promise<TaskAgentInterfaces.TaskAgentJobRequest[]>;
	    getAgentRequestsForAgents(poolId: number, agentIds: number[], completedRequestCount?: number): Q.Promise<TaskAgentInterfaces.TaskAgentJobRequest[]>;
	    getAgentRequestsForPlan(poolId: number, planId: string, jobId?: string): Q.Promise<TaskAgentInterfaces.TaskAgentJobRequest[]>;
	    queueAgentRequest(request: TaskAgentInterfaces.TaskAgentJobRequest, poolId: number): Q.Promise<TaskAgentInterfaces.TaskAgentJobRequest>;
	    updateAgentRequest(request: TaskAgentInterfaces.TaskAgentJobRequest, poolId: number, requestId: number, lockToken: string): Q.Promise<TaskAgentInterfaces.TaskAgentJobRequest>;
	    deleteMessage(poolId: number, messageId: number, sessionId: string): Q.Promise<void>;
	    getMessage(poolId: number, sessionId: string, lastMessageId?: number): Q.Promise<TaskAgentInterfaces.TaskAgentMessage>;
	    refreshAgent(poolId: number, agentId: number): Q.Promise<void>;
	    refreshAgents(poolId: number): Q.Promise<void>;
	    sendMessage(message: TaskAgentInterfaces.TaskAgentMessage, poolId: number, requestId: number): Q.Promise<void>;
	    getPackage(packageType: string): Q.Promise<TaskAgentInterfaces.TaskPackageMetadata>;
	    getPackages(): Q.Promise<TaskAgentInterfaces.TaskPackageMetadata[]>;
	    getPackageZip(packageType: string): Q.Promise<NodeJS.ReadableStream>;
	    getAgentPoolRoles(poolId?: number): Q.Promise<VSSInterfaces.IdentityRef[]>;
	    addAgentPool(pool: TaskAgentInterfaces.TaskAgentPool): Q.Promise<TaskAgentInterfaces.TaskAgentPool>;
	    deleteAgentPool(poolId: number): Q.Promise<void>;
	    getAgentPool(poolId: number, properties?: string[]): Q.Promise<TaskAgentInterfaces.TaskAgentPool>;
	    getAgentPools(poolName?: string, properties?: string[]): Q.Promise<TaskAgentInterfaces.TaskAgentPool[]>;
	    updateAgentPool(pool: TaskAgentInterfaces.TaskAgentPool, poolId: number): Q.Promise<TaskAgentInterfaces.TaskAgentPool>;
	    getAgentQueueRoles(queueId?: number): Q.Promise<VSSInterfaces.IdentityRef[]>;
	    addAgentQueue(queue: TaskAgentInterfaces.TaskAgentQueue): Q.Promise<TaskAgentInterfaces.TaskAgentQueue>;
	    deleteAgentQueue(queueId: number): Q.Promise<void>;
	    getAgentQueue(queueId: number, actionFilter?: TaskAgentInterfaces.TaskAgentQueueActionFilter): Q.Promise<TaskAgentInterfaces.TaskAgentQueue>;
	    getAgentQueues(queueName?: string, actionFilter?: TaskAgentInterfaces.TaskAgentQueueActionFilter): Q.Promise<TaskAgentInterfaces.TaskAgentQueue[]>;
	    queryServiceEndpoint(binding: TaskAgentInterfaces.DataSourceBinding, scopeIdentifier: string): Q.Promise<string[]>;
	    createServiceEndpoint(endpoint: TaskAgentInterfaces.ServiceEndpoint, scopeIdentifier: string): Q.Promise<TaskAgentInterfaces.ServiceEndpoint>;
	    deleteServiceEndpoint(scopeIdentifier: string, endpointId: string): Q.Promise<void>;
	    getServiceEndpointDetails(scopeIdentifier: string, endpointId: string): Q.Promise<TaskAgentInterfaces.ServiceEndpoint>;
	    getServiceEndpoints(scopeIdentifier: string, type?: string, authSchemes?: string[], endpointIds?: string[]): Q.Promise<TaskAgentInterfaces.ServiceEndpoint[]>;
	    updateServiceEndpoint(endpoint: TaskAgentInterfaces.ServiceEndpoint, scopeIdentifier: string, endpointId: string): Q.Promise<TaskAgentInterfaces.ServiceEndpoint>;
	    getServiceEndpointTypes(scopeIdentifier: string, type?: string, scheme?: string): Q.Promise<TaskAgentInterfaces.ServiceEndpointType[]>;
	    createAgentSession(session: TaskAgentInterfaces.TaskAgentSession, poolId: number): Q.Promise<TaskAgentInterfaces.TaskAgentSession>;
	    deleteAgentSession(poolId: number, sessionId: string): Q.Promise<void>;
	    deleteTaskDefinition(taskId: string): Q.Promise<void>;
	    getTaskContentZip(taskId: string, versionString: string, visibility?: string[], scopeLocal?: boolean): Q.Promise<NodeJS.ReadableStream>;
	    getTaskDefinition(taskId: string, versionString: string, visibility?: string[], scopeLocal?: boolean): Q.Promise<TaskAgentInterfaces.TaskDefinition>;
	    getTaskDefinitions(taskId?: string, visibility?: string[], scopeLocal?: boolean): Q.Promise<TaskAgentInterfaces.TaskDefinition[]>;
	    updateAgentUserCapabilities(userCapabilities: {
	        [key: string]: string;
	    }, poolId: number, agentId: number): Q.Promise<TaskAgentInterfaces.TaskAgent>;
	}
	export class TaskAgentApiBase extends basem.ClientApiBase implements ITaskAgentApiBase {
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	     * @param {TaskAgentInterfaces.TaskAgent} agent
	     * @param {number} poolId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgent
	     */
	    addAgent(agent: TaskAgentInterfaces.TaskAgent, poolId: number, onResult: (err: any, statusCode: number, agent: TaskAgentInterfaces.TaskAgent) => void): void;
	    /**
	     * @param {number} poolId
	     * @param {number} agentId
	     * @param onResult callback function
	     */
	    deleteAgent(poolId: number, agentId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {number} poolId
	     * @param {number} agentId
	     * @param {boolean} includeCapabilities
	     * @param {boolean} includeAssignedRequest
	     * @param {string[]} propertyFilters
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgent
	     */
	    getAgent(poolId: number, agentId: number, includeCapabilities: boolean, includeAssignedRequest: boolean, propertyFilters: string[], onResult: (err: any, statusCode: number, agent: TaskAgentInterfaces.TaskAgent) => void): void;
	    /**
	     * @param {number} poolId
	     * @param {string} agentName
	     * @param {boolean} includeCapabilities
	     * @param {boolean} includeAssignedRequest
	     * @param {string[]} propertyFilters
	     * @param {string[]} demands
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgent[]
	     */
	    getAgents(poolId: number, agentName: string, includeCapabilities: boolean, includeAssignedRequest: boolean, propertyFilters: string[], demands: string[], onResult: (err: any, statusCode: number, agents: TaskAgentInterfaces.TaskAgent[]) => void): void;
	    /**
	     * @param {TaskAgentInterfaces.TaskAgent} agent
	     * @param {number} poolId
	     * @param {number} agentId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgent
	     */
	    replaceAgent(agent: TaskAgentInterfaces.TaskAgent, poolId: number, agentId: number, onResult: (err: any, statusCode: number, agent: TaskAgentInterfaces.TaskAgent) => void): void;
	    /**
	     * @param {TaskAgentInterfaces.TaskAgent} agent
	     * @param {number} poolId
	     * @param {number} agentId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgent
	     */
	    updateAgent(agent: TaskAgentInterfaces.TaskAgent, poolId: number, agentId: number, onResult: (err: any, statusCode: number, agent: TaskAgentInterfaces.TaskAgent) => void): void;
	    /**
	     * Proxy for a GET request defined by an 'endpoint'. The request is authorized using a service connection. The response is filtered using an XPath/Json based selector.
	     *
	     * @param {TaskAgentInterfaces.TaskDefinitionEndpoint} endpoint - Describes the URL to fetch.
	     * @param onResult callback function with the resulting string[]
	     */
	    queryEndpoint(endpoint: TaskAgentInterfaces.TaskDefinitionEndpoint, onResult: (err: any, statusCode: number, endpoint: string[]) => void): void;
	    /**
	     * @param {number} poolId
	     * @param {number} requestId
	     * @param {string} lockToken
	     * @param onResult callback function
	     */
	    deleteAgentRequest(poolId: number, requestId: number, lockToken: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {number} poolId
	     * @param {number} requestId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentJobRequest
	     */
	    getAgentRequest(poolId: number, requestId: number, onResult: (err: any, statusCode: number, jobrequest: TaskAgentInterfaces.TaskAgentJobRequest) => void): void;
	    /**
	     * @param {number} poolId
	     * @param {number} agentId
	     * @param {number} completedRequestCount
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentJobRequest[]
	     */
	    getAgentRequestsForAgent(poolId: number, agentId: number, completedRequestCount: number, onResult: (err: any, statusCode: number, jobrequests: TaskAgentInterfaces.TaskAgentJobRequest[]) => void): void;
	    /**
	     * @param {number} poolId
	     * @param {number[]} agentIds
	     * @param {number} completedRequestCount
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentJobRequest[]
	     */
	    getAgentRequestsForAgents(poolId: number, agentIds: number[], completedRequestCount: number, onResult: (err: any, statusCode: number, jobrequests: TaskAgentInterfaces.TaskAgentJobRequest[]) => void): void;
	    /**
	     * @param {number} poolId
	     * @param {string} planId
	     * @param {string} jobId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentJobRequest[]
	     */
	    getAgentRequestsForPlan(poolId: number, planId: string, jobId: string, onResult: (err: any, statusCode: number, jobrequests: TaskAgentInterfaces.TaskAgentJobRequest[]) => void): void;
	    /**
	     * @param {TaskAgentInterfaces.TaskAgentJobRequest} request
	     * @param {number} poolId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentJobRequest
	     */
	    queueAgentRequest(request: TaskAgentInterfaces.TaskAgentJobRequest, poolId: number, onResult: (err: any, statusCode: number, jobrequest: TaskAgentInterfaces.TaskAgentJobRequest) => void): void;
	    /**
	     * @param {TaskAgentInterfaces.TaskAgentJobRequest} request
	     * @param {number} poolId
	     * @param {number} requestId
	     * @param {string} lockToken
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentJobRequest
	     */
	    updateAgentRequest(request: TaskAgentInterfaces.TaskAgentJobRequest, poolId: number, requestId: number, lockToken: string, onResult: (err: any, statusCode: number, jobrequest: TaskAgentInterfaces.TaskAgentJobRequest) => void): void;
	    /**
	     * @param {number} poolId
	     * @param {number} messageId
	     * @param {string} sessionId
	     * @param onResult callback function
	     */
	    deleteMessage(poolId: number, messageId: number, sessionId: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {number} poolId
	     * @param {string} sessionId
	     * @param {number} lastMessageId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentMessage
	     */
	    getMessage(poolId: number, sessionId: string, lastMessageId: number, onResult: (err: any, statusCode: number, message: TaskAgentInterfaces.TaskAgentMessage) => void): void;
	    /**
	     * @param {number} poolId
	     * @param {number} agentId
	     * @param onResult callback function
	     */
	    refreshAgent(poolId: number, agentId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {number} poolId
	     * @param onResult callback function
	     */
	    refreshAgents(poolId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {TaskAgentInterfaces.TaskAgentMessage} message
	     * @param {number} poolId
	     * @param {number} requestId
	     * @param onResult callback function
	     */
	    sendMessage(message: TaskAgentInterfaces.TaskAgentMessage, poolId: number, requestId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * This method can return packages/{packageType} -- package stream OR TaskPackageMetadata if requested for json
	     *
	     * @param {string} packageType
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskPackageMetadata
	     */
	    getPackage(packageType: string, onResult: (err: any, statusCode: number, _package: TaskAgentInterfaces.TaskPackageMetadata) => void): void;
	    /**
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskPackageMetadata[]
	     */
	    getPackages(onResult: (err: any, statusCode: number, packages: TaskAgentInterfaces.TaskPackageMetadata[]) => void): void;
	    /**
	     * This method can return packages/{packageType} -- package stream OR TaskPackageMetadata if requested for json
	     *
	     * @param {string} packageType
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getPackageZip(packageType: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {number} poolId
	     * @param onResult callback function with the resulting VSSInterfaces.IdentityRef[]
	     */
	    getAgentPoolRoles(poolId: number, onResult: (err: any, statusCode: number, poolroles: VSSInterfaces.IdentityRef[]) => void): void;
	    /**
	     * @param {TaskAgentInterfaces.TaskAgentPool} pool
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentPool
	     */
	    addAgentPool(pool: TaskAgentInterfaces.TaskAgentPool, onResult: (err: any, statusCode: number, pool: TaskAgentInterfaces.TaskAgentPool) => void): void;
	    /**
	     * @param {number} poolId
	     * @param onResult callback function
	     */
	    deleteAgentPool(poolId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {number} poolId
	     * @param {string[]} properties
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentPool
	     */
	    getAgentPool(poolId: number, properties: string[], onResult: (err: any, statusCode: number, pool: TaskAgentInterfaces.TaskAgentPool) => void): void;
	    /**
	     * @param {string} poolName
	     * @param {string[]} properties
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentPool[]
	     */
	    getAgentPools(poolName: string, properties: string[], onResult: (err: any, statusCode: number, pools: TaskAgentInterfaces.TaskAgentPool[]) => void): void;
	    /**
	     * @param {TaskAgentInterfaces.TaskAgentPool} pool
	     * @param {number} poolId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentPool
	     */
	    updateAgentPool(pool: TaskAgentInterfaces.TaskAgentPool, poolId: number, onResult: (err: any, statusCode: number, pool: TaskAgentInterfaces.TaskAgentPool) => void): void;
	    /**
	     * @param {number} queueId
	     * @param onResult callback function with the resulting VSSInterfaces.IdentityRef[]
	     */
	    getAgentQueueRoles(queueId: number, onResult: (err: any, statusCode: number, queueroles: VSSInterfaces.IdentityRef[]) => void): void;
	    /**
	     * @param {TaskAgentInterfaces.TaskAgentQueue} queue
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentQueue
	     */
	    addAgentQueue(queue: TaskAgentInterfaces.TaskAgentQueue, onResult: (err: any, statusCode: number, queue: TaskAgentInterfaces.TaskAgentQueue) => void): void;
	    /**
	     * @param {number} queueId
	     * @param onResult callback function
	     */
	    deleteAgentQueue(queueId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {number} queueId
	     * @param {TaskAgentInterfaces.TaskAgentQueueActionFilter} actionFilter
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentQueue
	     */
	    getAgentQueue(queueId: number, actionFilter: TaskAgentInterfaces.TaskAgentQueueActionFilter, onResult: (err: any, statusCode: number, queue: TaskAgentInterfaces.TaskAgentQueue) => void): void;
	    /**
	     * @param {string} queueName
	     * @param {TaskAgentInterfaces.TaskAgentQueueActionFilter} actionFilter
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentQueue[]
	     */
	    getAgentQueues(queueName: string, actionFilter: TaskAgentInterfaces.TaskAgentQueueActionFilter, onResult: (err: any, statusCode: number, queues: TaskAgentInterfaces.TaskAgentQueue[]) => void): void;
	    /**
	     * Proxy for a GET request defined by an service endpoint. The request is authorized using a data source in service endpoint. The response is filtered using an XPath/Json based selector.
	     *
	     * @param {TaskAgentInterfaces.DataSourceBinding} binding - Describes the data source to fetch.
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param onResult callback function with the resulting string[]
	     */
	    queryServiceEndpoint(binding: TaskAgentInterfaces.DataSourceBinding, scopeIdentifier: string, onResult: (err: any, statusCode: number, serviceendpointproxy: string[]) => void): void;
	    /**
	     * @param {TaskAgentInterfaces.ServiceEndpoint} endpoint
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param onResult callback function with the resulting TaskAgentInterfaces.ServiceEndpoint
	     */
	    createServiceEndpoint(endpoint: TaskAgentInterfaces.ServiceEndpoint, scopeIdentifier: string, onResult: (err: any, statusCode: number, serviceendpoint: TaskAgentInterfaces.ServiceEndpoint) => void): void;
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} endpointId
	     * @param onResult callback function
	     */
	    deleteServiceEndpoint(scopeIdentifier: string, endpointId: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} endpointId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.ServiceEndpoint
	     */
	    getServiceEndpointDetails(scopeIdentifier: string, endpointId: string, onResult: (err: any, statusCode: number, serviceendpoint: TaskAgentInterfaces.ServiceEndpoint) => void): void;
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} type
	     * @param {string[]} authSchemes
	     * @param {string[]} endpointIds
	     * @param onResult callback function with the resulting TaskAgentInterfaces.ServiceEndpoint[]
	     */
	    getServiceEndpoints(scopeIdentifier: string, type: string, authSchemes: string[], endpointIds: string[], onResult: (err: any, statusCode: number, serviceendpoints: TaskAgentInterfaces.ServiceEndpoint[]) => void): void;
	    /**
	     * @param {TaskAgentInterfaces.ServiceEndpoint} endpoint
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} endpointId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.ServiceEndpoint
	     */
	    updateServiceEndpoint(endpoint: TaskAgentInterfaces.ServiceEndpoint, scopeIdentifier: string, endpointId: string, onResult: (err: any, statusCode: number, serviceendpoint: TaskAgentInterfaces.ServiceEndpoint) => void): void;
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} type
	     * @param {string} scheme
	     * @param onResult callback function with the resulting TaskAgentInterfaces.ServiceEndpointType[]
	     */
	    getServiceEndpointTypes(scopeIdentifier: string, type: string, scheme: string, onResult: (err: any, statusCode: number, serviceendpointtypes: TaskAgentInterfaces.ServiceEndpointType[]) => void): void;
	    /**
	     * @param {TaskAgentInterfaces.TaskAgentSession} session
	     * @param {number} poolId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgentSession
	     */
	    createAgentSession(session: TaskAgentInterfaces.TaskAgentSession, poolId: number, onResult: (err: any, statusCode: number, session: TaskAgentInterfaces.TaskAgentSession) => void): void;
	    /**
	     * @param {number} poolId
	     * @param {string} sessionId
	     * @param onResult callback function
	     */
	    deleteAgentSession(poolId: number, sessionId: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} taskId
	     * @param onResult callback function
	     */
	    deleteTaskDefinition(taskId: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} taskId
	     * @param {string} versionString
	     * @param {string[]} visibility
	     * @param {boolean} scopeLocal
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getTaskContentZip(taskId: string, versionString: string, visibility: string[], scopeLocal: boolean, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {string} taskId
	     * @param {string} versionString
	     * @param {string[]} visibility
	     * @param {boolean} scopeLocal
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskDefinition
	     */
	    getTaskDefinition(taskId: string, versionString: string, visibility: string[], scopeLocal: boolean, onResult: (err: any, statusCode: number, task: TaskAgentInterfaces.TaskDefinition) => void): void;
	    /**
	     * @param {string} taskId
	     * @param {string[]} visibility
	     * @param {boolean} scopeLocal
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskDefinition[]
	     */
	    getTaskDefinitions(taskId: string, visibility: string[], scopeLocal: boolean, onResult: (err: any, statusCode: number, tasks: TaskAgentInterfaces.TaskDefinition[]) => void): void;
	    /**
	     * @param {{ [key: string] : string; }} userCapabilities
	     * @param {number} poolId
	     * @param {number} agentId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAgent
	     */
	    updateAgentUserCapabilities(userCapabilities: {
	        [key: string]: string;
	    }, poolId: number, agentId: number, onResult: (err: any, statusCode: number, usercapabilitie: TaskAgentInterfaces.TaskAgent) => void): void;
	}
	export class QTaskAgentApiBase extends basem.QClientApiBase implements IQTaskAgentApiBase {
	    api: TaskAgentApiBase;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[], api: typeof basem.ClientApiBase);
	    /**
	    * @param {TaskAgentInterfaces.TaskAgent} agent
	    * @param {number} poolId
	    */
	    addAgent(agent: TaskAgentInterfaces.TaskAgent, poolId: number): Q.Promise<TaskAgentInterfaces.TaskAgent>;
	    /**
	    * @param {number} poolId
	    * @param {number} agentId
	    */
	    deleteAgent(poolId: number, agentId: number): Q.Promise<void>;
	    /**
	    * @param {number} poolId
	    * @param {number} agentId
	    * @param {boolean} includeCapabilities
	    * @param {boolean} includeAssignedRequest
	    * @param {string[]} propertyFilters
	    */
	    getAgent(poolId: number, agentId: number, includeCapabilities?: boolean, includeAssignedRequest?: boolean, propertyFilters?: string[]): Q.Promise<TaskAgentInterfaces.TaskAgent>;
	    /**
	    * @param {number} poolId
	    * @param {string} agentName
	    * @param {boolean} includeCapabilities
	    * @param {boolean} includeAssignedRequest
	    * @param {string[]} propertyFilters
	    * @param {string[]} demands
	    */
	    getAgents(poolId: number, agentName?: string, includeCapabilities?: boolean, includeAssignedRequest?: boolean, propertyFilters?: string[], demands?: string[]): Q.Promise<TaskAgentInterfaces.TaskAgent[]>;
	    /**
	    * @param {TaskAgentInterfaces.TaskAgent} agent
	    * @param {number} poolId
	    * @param {number} agentId
	    */
	    replaceAgent(agent: TaskAgentInterfaces.TaskAgent, poolId: number, agentId: number): Q.Promise<TaskAgentInterfaces.TaskAgent>;
	    /**
	    * @param {TaskAgentInterfaces.TaskAgent} agent
	    * @param {number} poolId
	    * @param {number} agentId
	    */
	    updateAgent(agent: TaskAgentInterfaces.TaskAgent, poolId: number, agentId: number): Q.Promise<TaskAgentInterfaces.TaskAgent>;
	    /**
	    * Proxy for a GET request defined by an 'endpoint'. The request is authorized using a service connection. The response is filtered using an XPath/Json based selector.
	    *
	    * @param {TaskAgentInterfaces.TaskDefinitionEndpoint} endpoint - Describes the URL to fetch.
	    */
	    queryEndpoint(endpoint: TaskAgentInterfaces.TaskDefinitionEndpoint): Q.Promise<string[]>;
	    /**
	    * @param {number} poolId
	    * @param {number} requestId
	    * @param {string} lockToken
	    */
	    deleteAgentRequest(poolId: number, requestId: number, lockToken: string): Q.Promise<void>;
	    /**
	    * @param {number} poolId
	    * @param {number} requestId
	    */
	    getAgentRequest(poolId: number, requestId: number): Q.Promise<TaskAgentInterfaces.TaskAgentJobRequest>;
	    /**
	    * @param {number} poolId
	    * @param {number} agentId
	    * @param {number} completedRequestCount
	    */
	    getAgentRequestsForAgent(poolId: number, agentId: number, completedRequestCount?: number): Q.Promise<TaskAgentInterfaces.TaskAgentJobRequest[]>;
	    /**
	    * @param {number} poolId
	    * @param {number[]} agentIds
	    * @param {number} completedRequestCount
	    */
	    getAgentRequestsForAgents(poolId: number, agentIds: number[], completedRequestCount?: number): Q.Promise<TaskAgentInterfaces.TaskAgentJobRequest[]>;
	    /**
	    * @param {number} poolId
	    * @param {string} planId
	    * @param {string} jobId
	    */
	    getAgentRequestsForPlan(poolId: number, planId: string, jobId?: string): Q.Promise<TaskAgentInterfaces.TaskAgentJobRequest[]>;
	    /**
	    * @param {TaskAgentInterfaces.TaskAgentJobRequest} request
	    * @param {number} poolId
	    */
	    queueAgentRequest(request: TaskAgentInterfaces.TaskAgentJobRequest, poolId: number): Q.Promise<TaskAgentInterfaces.TaskAgentJobRequest>;
	    /**
	    * @param {TaskAgentInterfaces.TaskAgentJobRequest} request
	    * @param {number} poolId
	    * @param {number} requestId
	    * @param {string} lockToken
	    */
	    updateAgentRequest(request: TaskAgentInterfaces.TaskAgentJobRequest, poolId: number, requestId: number, lockToken: string): Q.Promise<TaskAgentInterfaces.TaskAgentJobRequest>;
	    /**
	    * @param {number} poolId
	    * @param {number} messageId
	    * @param {string} sessionId
	    */
	    deleteMessage(poolId: number, messageId: number, sessionId: string): Q.Promise<void>;
	    /**
	    * @param {number} poolId
	    * @param {string} sessionId
	    * @param {number} lastMessageId
	    */
	    getMessage(poolId: number, sessionId: string, lastMessageId?: number): Q.Promise<TaskAgentInterfaces.TaskAgentMessage>;
	    /**
	    * @param {number} poolId
	    * @param {number} agentId
	    */
	    refreshAgent(poolId: number, agentId: number): Q.Promise<void>;
	    /**
	    * @param {number} poolId
	    */
	    refreshAgents(poolId: number): Q.Promise<void>;
	    /**
	    * @param {TaskAgentInterfaces.TaskAgentMessage} message
	    * @param {number} poolId
	    * @param {number} requestId
	    */
	    sendMessage(message: TaskAgentInterfaces.TaskAgentMessage, poolId: number, requestId: number): Q.Promise<void>;
	    /**
	    * This method can return packages/{packageType} -- package stream OR TaskPackageMetadata if requested for json
	    *
	    * @param {string} packageType
	    */
	    getPackage(packageType: string): Q.Promise<TaskAgentInterfaces.TaskPackageMetadata>;
	    /**
	    */
	    getPackages(): Q.Promise<TaskAgentInterfaces.TaskPackageMetadata[]>;
	    /**
	    * This method can return packages/{packageType} -- package stream OR TaskPackageMetadata if requested for json
	    *
	    * @param {string} packageType
	    */
	    getPackageZip(packageType: string): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {number} poolId
	    */
	    getAgentPoolRoles(poolId?: number): Q.Promise<VSSInterfaces.IdentityRef[]>;
	    /**
	    * @param {TaskAgentInterfaces.TaskAgentPool} pool
	    */
	    addAgentPool(pool: TaskAgentInterfaces.TaskAgentPool): Q.Promise<TaskAgentInterfaces.TaskAgentPool>;
	    /**
	    * @param {number} poolId
	    */
	    deleteAgentPool(poolId: number): Q.Promise<void>;
	    /**
	    * @param {number} poolId
	    * @param {string[]} properties
	    */
	    getAgentPool(poolId: number, properties?: string[]): Q.Promise<TaskAgentInterfaces.TaskAgentPool>;
	    /**
	    * @param {string} poolName
	    * @param {string[]} properties
	    */
	    getAgentPools(poolName?: string, properties?: string[]): Q.Promise<TaskAgentInterfaces.TaskAgentPool[]>;
	    /**
	    * @param {TaskAgentInterfaces.TaskAgentPool} pool
	    * @param {number} poolId
	    */
	    updateAgentPool(pool: TaskAgentInterfaces.TaskAgentPool, poolId: number): Q.Promise<TaskAgentInterfaces.TaskAgentPool>;
	    /**
	    * @param {number} queueId
	    */
	    getAgentQueueRoles(queueId?: number): Q.Promise<VSSInterfaces.IdentityRef[]>;
	    /**
	    * @param {TaskAgentInterfaces.TaskAgentQueue} queue
	    */
	    addAgentQueue(queue: TaskAgentInterfaces.TaskAgentQueue): Q.Promise<TaskAgentInterfaces.TaskAgentQueue>;
	    /**
	    * @param {number} queueId
	    */
	    deleteAgentQueue(queueId: number): Q.Promise<void>;
	    /**
	    * @param {number} queueId
	    * @param {TaskAgentInterfaces.TaskAgentQueueActionFilter} actionFilter
	    */
	    getAgentQueue(queueId: number, actionFilter?: TaskAgentInterfaces.TaskAgentQueueActionFilter): Q.Promise<TaskAgentInterfaces.TaskAgentQueue>;
	    /**
	    * @param {string} queueName
	    * @param {TaskAgentInterfaces.TaskAgentQueueActionFilter} actionFilter
	    */
	    getAgentQueues(queueName?: string, actionFilter?: TaskAgentInterfaces.TaskAgentQueueActionFilter): Q.Promise<TaskAgentInterfaces.TaskAgentQueue[]>;
	    /**
	    * Proxy for a GET request defined by an service endpoint. The request is authorized using a data source in service endpoint. The response is filtered using an XPath/Json based selector.
	    *
	    * @param {TaskAgentInterfaces.DataSourceBinding} binding - Describes the data source to fetch.
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    */
	    queryServiceEndpoint(binding: TaskAgentInterfaces.DataSourceBinding, scopeIdentifier: string): Q.Promise<string[]>;
	    /**
	    * @param {TaskAgentInterfaces.ServiceEndpoint} endpoint
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    */
	    createServiceEndpoint(endpoint: TaskAgentInterfaces.ServiceEndpoint, scopeIdentifier: string): Q.Promise<TaskAgentInterfaces.ServiceEndpoint>;
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} endpointId
	    */
	    deleteServiceEndpoint(scopeIdentifier: string, endpointId: string): Q.Promise<void>;
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} endpointId
	    */
	    getServiceEndpointDetails(scopeIdentifier: string, endpointId: string): Q.Promise<TaskAgentInterfaces.ServiceEndpoint>;
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} type
	    * @param {string[]} authSchemes
	    * @param {string[]} endpointIds
	    */
	    getServiceEndpoints(scopeIdentifier: string, type?: string, authSchemes?: string[], endpointIds?: string[]): Q.Promise<TaskAgentInterfaces.ServiceEndpoint[]>;
	    /**
	    * @param {TaskAgentInterfaces.ServiceEndpoint} endpoint
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} endpointId
	    */
	    updateServiceEndpoint(endpoint: TaskAgentInterfaces.ServiceEndpoint, scopeIdentifier: string, endpointId: string): Q.Promise<TaskAgentInterfaces.ServiceEndpoint>;
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} type
	    * @param {string} scheme
	    */
	    getServiceEndpointTypes(scopeIdentifier: string, type?: string, scheme?: string): Q.Promise<TaskAgentInterfaces.ServiceEndpointType[]>;
	    /**
	    * @param {TaskAgentInterfaces.TaskAgentSession} session
	    * @param {number} poolId
	    */
	    createAgentSession(session: TaskAgentInterfaces.TaskAgentSession, poolId: number): Q.Promise<TaskAgentInterfaces.TaskAgentSession>;
	    /**
	    * @param {number} poolId
	    * @param {string} sessionId
	    */
	    deleteAgentSession(poolId: number, sessionId: string): Q.Promise<void>;
	    /**
	    * @param {string} taskId
	    */
	    deleteTaskDefinition(taskId: string): Q.Promise<void>;
	    /**
	    * @param {string} taskId
	    * @param {string} versionString
	    * @param {string[]} visibility
	    * @param {boolean} scopeLocal
	    */
	    getTaskContentZip(taskId: string, versionString: string, visibility?: string[], scopeLocal?: boolean): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {string} taskId
	    * @param {string} versionString
	    * @param {string[]} visibility
	    * @param {boolean} scopeLocal
	    */
	    getTaskDefinition(taskId: string, versionString: string, visibility?: string[], scopeLocal?: boolean): Q.Promise<TaskAgentInterfaces.TaskDefinition>;
	    /**
	    * @param {string} taskId
	    * @param {string[]} visibility
	    * @param {boolean} scopeLocal
	    */
	    getTaskDefinitions(taskId?: string, visibility?: string[], scopeLocal?: boolean): Q.Promise<TaskAgentInterfaces.TaskDefinition[]>;
	    /**
	    * @param {{ [key: string] : string; }} userCapabilities
	    * @param {number} poolId
	    * @param {number} agentId
	    */
	    updateAgentUserCapabilities(userCapabilities: {
	        [key: string]: string;
	    }, poolId: number, agentId: number): Q.Promise<TaskAgentInterfaces.TaskAgent>;
	}

}
declare module 'vso-node-api/TaskAgentApi' {
	import taskagentbasem = require('vso-node-api/TaskAgentApiBase');
	import Q = require("q");
	import TaskAgentInterfaces = require('vso-node-api/interfaces/TaskAgentInterfaces');
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	export interface ITaskAgentApi extends taskagentbasem.ITaskAgentApiBase {
	    uploadTaskDefinition(customHeaders: VsoBaseInterfaces.IHeaders, contentStream: NodeJS.ReadableStream, taskId: string, overwrite: boolean, onResult: (err: any, statusCode: number, obj: any) => void): void;
	}
	export interface IQTaskAgentApi extends taskagentbasem.IQTaskAgentApiBase {
	    uploadTaskDefinition(customHeaders: VsoBaseInterfaces.IHeaders, contentStream: NodeJS.ReadableStream, taskId: string, overwrite: boolean): Q.Promise<void>;
	}
	export class TaskAgentApi extends taskagentbasem.TaskAgentApiBase implements ITaskAgentApi {
	    private _handlers;
	    private _fallbackClient;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	     * @param {string} taskId
	     * @param onResult callback function
	     */
	    deleteTaskDefinition(taskId: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} taskId
	     * @param {string} versionString
	     * @param {string[]} visibility
	     * @param {boolean} scopeLocal
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getTaskContentZip(taskId: string, versionString: string, visibility: string[], scopeLocal: boolean, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {string} taskId
	     * @param {string} versionString
	     * @param {string[]} visibility
	     * @param {boolean} scopeLocal
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskDefinition
	     */
	    getTaskDefinition(taskId: string, versionString: string, visibility: string[], scopeLocal: boolean, onResult: (err: any, statusCode: number, task: TaskAgentInterfaces.TaskDefinition) => void): void;
	    /**
	     * @param {string} taskId
	     * @param {string[]} visibility
	     * @param {boolean} scopeLocal
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskDefinition[]
	     */
	    getTaskDefinitions(taskId: string, visibility: string[], scopeLocal: boolean, onResult: (err: any, statusCode: number, tasks: TaskAgentInterfaces.TaskDefinition[]) => void): void;
	    /**
	     * @param {NodeJS.ReadableStream} contentStream
	     * @param {string} taskId
	     * @param {boolean} overwrite
	     * @param onResult callback function
	     */
	    uploadTaskDefinition(customHeaders: VsoBaseInterfaces.IHeaders, contentStream: NodeJS.ReadableStream, taskId: string, overwrite: boolean, onResult: (err: any, statusCode: number, obj: any) => void): void;
	    /**
	     * @param {NodeJS.ReadableStream} contentStream
	     * @param {string} taskId
	     * @param {boolean} overwrite
	     * @param onResult callback function
	     */
	    private _uploadTaskDefinition(customHeaders, contentStream, taskId, overwrite, onResult);
	    private _getFallbackClient(baseUrl);
	    private _getAccountUrl(collectionUrl);
	}
	export class QTaskAgentApi extends taskagentbasem.QTaskAgentApiBase implements IQTaskAgentApi {
	    api: TaskAgentApi;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	    * @param {NodeJS.ReadableStream} contentStream
	    * @param {string} taskId
	    * @param {boolean} overwrite
	    */
	    uploadTaskDefinition(customHeaders: VsoBaseInterfaces.IHeaders, contentStream: NodeJS.ReadableStream, taskId: string, overwrite: boolean): Q.Promise<void>;
	}

}
declare module 'vso-node-api/TaskApi' {
	/// <reference path="../node/node.d.ts" />
	/// <reference path="../q/Q.d.ts" />
	import Q = require('q');
	import basem = require('vso-node-api/ClientApiBases');
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	import TaskAgentInterfaces = require('vso-node-api/interfaces/TaskAgentInterfaces');
	import VSSInterfaces = require('vso-node-api/interfaces/common/VSSInterfaces');
	export interface ITaskApi extends basem.ClientApiBase {
	    getPlanAttachments(scopeIdentifier: string, hubName: string, planId: string, type: string, onResult: (err: any, statusCode: number, attachments: TaskAgentInterfaces.TaskAttachment[]) => void): void;
	    createAttachment(customHeaders: any, contentStream: NodeJS.ReadableStream, scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string, name: string, onResult: (err: any, statusCode: number, attachment: TaskAgentInterfaces.TaskAttachment) => void): void;
	    getAttachment(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string, name: string, onResult: (err: any, statusCode: number, attachment: TaskAgentInterfaces.TaskAttachment) => void): void;
	    getAttachmentContent(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string, name: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getAttachments(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string, onResult: (err: any, statusCode: number, attachments: TaskAgentInterfaces.TaskAttachment[]) => void): void;
	    appendTimelineRecordFeed(lines: VSSInterfaces.VssJsonCollectionWrapperV<string[]>, scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, onResult: (err: any, statusCode: number) => void): void;
	    appendLogContent(customHeaders: any, contentStream: NodeJS.ReadableStream, scopeIdentifier: string, hubName: string, planId: string, logId: number, onResult: (err: any, statusCode: number, log: TaskAgentInterfaces.TaskLog) => void): void;
	    createLog(log: TaskAgentInterfaces.TaskLog, scopeIdentifier: string, hubName: string, planId: string, onResult: (err: any, statusCode: number, log: TaskAgentInterfaces.TaskLog) => void): void;
	    getLog(scopeIdentifier: string, hubName: string, planId: string, logId: number, startLine: number, endLine: number, onResult: (err: any, statusCode: number, logs: string[]) => void): void;
	    getLogs(scopeIdentifier: string, hubName: string, planId: string, onResult: (err: any, statusCode: number, logs: TaskAgentInterfaces.TaskLog[]) => void): void;
	    getPlan(scopeIdentifier: string, hubName: string, planId: string, onResult: (err: any, statusCode: number, plan: TaskAgentInterfaces.TaskOrchestrationPlan) => void): void;
	    getRecords(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, changeId: number, onResult: (err: any, statusCode: number, records: TaskAgentInterfaces.TimelineRecord[]) => void): void;
	    updateRecords(records: VSSInterfaces.VssJsonCollectionWrapperV<TaskAgentInterfaces.TimelineRecord[]>, scopeIdentifier: string, hubName: string, planId: string, timelineId: string, onResult: (err: any, statusCode: number, record: TaskAgentInterfaces.TimelineRecord[]) => void): void;
	    createTimeline(timeline: TaskAgentInterfaces.Timeline, scopeIdentifier: string, hubName: string, planId: string, onResult: (err: any, statusCode: number, timeline: TaskAgentInterfaces.Timeline) => void): void;
	    deleteTimeline(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, onResult: (err: any, statusCode: number) => void): void;
	    getTimeline(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, changeId: number, includeRecords: boolean, onResult: (err: any, statusCode: number, timeline: TaskAgentInterfaces.Timeline) => void): void;
	    getTimelines(scopeIdentifier: string, hubName: string, planId: string, onResult: (err: any, statusCode: number, timelines: TaskAgentInterfaces.Timeline[]) => void): void;
	}
	export interface IQTaskApi extends basem.QClientApiBase {
	    getPlanAttachments(scopeIdentifier: string, hubName: string, planId: string, type: string): Q.Promise<TaskAgentInterfaces.TaskAttachment[]>;
	    createAttachment(customHeaders: any, contentStream: NodeJS.ReadableStream, scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string, name: string): Q.Promise<TaskAgentInterfaces.TaskAttachment>;
	    getAttachment(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string, name: string): Q.Promise<TaskAgentInterfaces.TaskAttachment>;
	    getAttachmentContent(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string, name: string): Q.Promise<NodeJS.ReadableStream>;
	    getAttachments(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string): Q.Promise<TaskAgentInterfaces.TaskAttachment[]>;
	    appendTimelineRecordFeed(lines: VSSInterfaces.VssJsonCollectionWrapperV<string[]>, scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string): Q.Promise<void>;
	    appendLogContent(customHeaders: any, contentStream: NodeJS.ReadableStream, scopeIdentifier: string, hubName: string, planId: string, logId: number): Q.Promise<TaskAgentInterfaces.TaskLog>;
	    createLog(log: TaskAgentInterfaces.TaskLog, scopeIdentifier: string, hubName: string, planId: string): Q.Promise<TaskAgentInterfaces.TaskLog>;
	    getLog(scopeIdentifier: string, hubName: string, planId: string, logId: number, startLine?: number, endLine?: number): Q.Promise<string[]>;
	    getLogs(scopeIdentifier: string, hubName: string, planId: string): Q.Promise<TaskAgentInterfaces.TaskLog[]>;
	    getPlan(scopeIdentifier: string, hubName: string, planId: string): Q.Promise<TaskAgentInterfaces.TaskOrchestrationPlan>;
	    getRecords(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, changeId?: number): Q.Promise<TaskAgentInterfaces.TimelineRecord[]>;
	    updateRecords(records: VSSInterfaces.VssJsonCollectionWrapperV<TaskAgentInterfaces.TimelineRecord[]>, scopeIdentifier: string, hubName: string, planId: string, timelineId: string): Q.Promise<TaskAgentInterfaces.TimelineRecord[]>;
	    createTimeline(timeline: TaskAgentInterfaces.Timeline, scopeIdentifier: string, hubName: string, planId: string): Q.Promise<TaskAgentInterfaces.Timeline>;
	    deleteTimeline(scopeIdentifier: string, hubName: string, planId: string, timelineId: string): Q.Promise<void>;
	    getTimeline(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, changeId?: number, includeRecords?: boolean): Q.Promise<TaskAgentInterfaces.Timeline>;
	    getTimelines(scopeIdentifier: string, hubName: string, planId: string): Q.Promise<TaskAgentInterfaces.Timeline[]>;
	}
	export class TaskApi extends basem.ClientApiBase implements ITaskApi {
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param {string} type
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAttachment[]
	     */
	    getPlanAttachments(scopeIdentifier: string, hubName: string, planId: string, type: string, onResult: (err: any, statusCode: number, attachments: TaskAgentInterfaces.TaskAttachment[]) => void): void;
	    /**
	     * @param {NodeJS.ReadableStream} contentStream - Content to upload
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param {string} timelineId
	     * @param {string} recordId
	     * @param {string} type
	     * @param {string} name
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAttachment
	     */
	    createAttachment(customHeaders: VsoBaseInterfaces.IHeaders, contentStream: NodeJS.ReadableStream, scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string, name: string, onResult: (err: any, statusCode: number, attachment: TaskAgentInterfaces.TaskAttachment) => void): void;
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param {string} timelineId
	     * @param {string} recordId
	     * @param {string} type
	     * @param {string} name
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAttachment
	     */
	    getAttachment(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string, name: string, onResult: (err: any, statusCode: number, attachment: TaskAgentInterfaces.TaskAttachment) => void): void;
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param {string} timelineId
	     * @param {string} recordId
	     * @param {string} type
	     * @param {string} name
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getAttachmentContent(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string, name: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param {string} timelineId
	     * @param {string} recordId
	     * @param {string} type
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskAttachment[]
	     */
	    getAttachments(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string, onResult: (err: any, statusCode: number, attachments: TaskAgentInterfaces.TaskAttachment[]) => void): void;
	    /**
	     * @param {VSSInterfaces.VssJsonCollectionWrapperV<string[]>} lines
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param {string} timelineId
	     * @param {string} recordId
	     * @param onResult callback function
	     */
	    appendTimelineRecordFeed(lines: VSSInterfaces.VssJsonCollectionWrapperV<string[]>, scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {NodeJS.ReadableStream} contentStream - Content to upload
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param {number} logId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskLog
	     */
	    appendLogContent(customHeaders: VsoBaseInterfaces.IHeaders, contentStream: NodeJS.ReadableStream, scopeIdentifier: string, hubName: string, planId: string, logId: number, onResult: (err: any, statusCode: number, log: TaskAgentInterfaces.TaskLog) => void): void;
	    /**
	     * @param {TaskAgentInterfaces.TaskLog} log
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskLog
	     */
	    createLog(log: TaskAgentInterfaces.TaskLog, scopeIdentifier: string, hubName: string, planId: string, onResult: (err: any, statusCode: number, log: TaskAgentInterfaces.TaskLog) => void): void;
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param {number} logId
	     * @param {number} startLine
	     * @param {number} endLine
	     * @param onResult callback function with the resulting string[]
	     */
	    getLog(scopeIdentifier: string, hubName: string, planId: string, logId: number, startLine: number, endLine: number, onResult: (err: any, statusCode: number, logs: string[]) => void): void;
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskLog[]
	     */
	    getLogs(scopeIdentifier: string, hubName: string, planId: string, onResult: (err: any, statusCode: number, logs: TaskAgentInterfaces.TaskLog[]) => void): void;
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TaskOrchestrationPlan
	     */
	    getPlan(scopeIdentifier: string, hubName: string, planId: string, onResult: (err: any, statusCode: number, plan: TaskAgentInterfaces.TaskOrchestrationPlan) => void): void;
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param {string} timelineId
	     * @param {number} changeId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TimelineRecord[]
	     */
	    getRecords(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, changeId: number, onResult: (err: any, statusCode: number, records: TaskAgentInterfaces.TimelineRecord[]) => void): void;
	    /**
	     * @param {VSSInterfaces.VssJsonCollectionWrapperV<TaskAgentInterfaces.TimelineRecord[]>} records
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param {string} timelineId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.TimelineRecord[]
	     */
	    updateRecords(records: VSSInterfaces.VssJsonCollectionWrapperV<TaskAgentInterfaces.TimelineRecord[]>, scopeIdentifier: string, hubName: string, planId: string, timelineId: string, onResult: (err: any, statusCode: number, record: TaskAgentInterfaces.TimelineRecord[]) => void): void;
	    /**
	     * @param {TaskAgentInterfaces.Timeline} timeline
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.Timeline
	     */
	    createTimeline(timeline: TaskAgentInterfaces.Timeline, scopeIdentifier: string, hubName: string, planId: string, onResult: (err: any, statusCode: number, timeline: TaskAgentInterfaces.Timeline) => void): void;
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param {string} timelineId
	     * @param onResult callback function
	     */
	    deleteTimeline(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param {string} timelineId
	     * @param {number} changeId
	     * @param {boolean} includeRecords
	     * @param onResult callback function with the resulting TaskAgentInterfaces.Timeline
	     */
	    getTimeline(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, changeId: number, includeRecords: boolean, onResult: (err: any, statusCode: number, timeline: TaskAgentInterfaces.Timeline) => void): void;
	    /**
	     * @param {string} scopeIdentifier - The project GUID to scope the request
	     * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	     * @param {string} planId
	     * @param onResult callback function with the resulting TaskAgentInterfaces.Timeline[]
	     */
	    getTimelines(scopeIdentifier: string, hubName: string, planId: string, onResult: (err: any, statusCode: number, timelines: TaskAgentInterfaces.Timeline[]) => void): void;
	}
	export class QTaskApi extends basem.QClientApiBase implements IQTaskApi {
	    api: TaskApi;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    * @param {string} type
	    */
	    getPlanAttachments(scopeIdentifier: string, hubName: string, planId: string, type: string): Q.Promise<TaskAgentInterfaces.TaskAttachment[]>;
	    /**
	    * @param {NodeJS.ReadableStream} contentStream - Content to upload
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    * @param {string} timelineId
	    * @param {string} recordId
	    * @param {string} type
	    * @param {string} name
	    */
	    createAttachment(customHeaders: any, contentStream: NodeJS.ReadableStream, scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string, name: string): Q.Promise<TaskAgentInterfaces.TaskAttachment>;
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    * @param {string} timelineId
	    * @param {string} recordId
	    * @param {string} type
	    * @param {string} name
	    */
	    getAttachment(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string, name: string): Q.Promise<TaskAgentInterfaces.TaskAttachment>;
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    * @param {string} timelineId
	    * @param {string} recordId
	    * @param {string} type
	    * @param {string} name
	    */
	    getAttachmentContent(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string, name: string): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    * @param {string} timelineId
	    * @param {string} recordId
	    * @param {string} type
	    */
	    getAttachments(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string, type: string): Q.Promise<TaskAgentInterfaces.TaskAttachment[]>;
	    /**
	    * @param {VSSInterfaces.VssJsonCollectionWrapperV<string[]>} lines
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    * @param {string} timelineId
	    * @param {string} recordId
	    */
	    appendTimelineRecordFeed(lines: VSSInterfaces.VssJsonCollectionWrapperV<string[]>, scopeIdentifier: string, hubName: string, planId: string, timelineId: string, recordId: string): Q.Promise<void>;
	    /**
	    * @param {NodeJS.ReadableStream} contentStream - Content to upload
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    * @param {number} logId
	    */
	    appendLogContent(customHeaders: any, contentStream: NodeJS.ReadableStream, scopeIdentifier: string, hubName: string, planId: string, logId: number): Q.Promise<TaskAgentInterfaces.TaskLog>;
	    /**
	    * @param {TaskAgentInterfaces.TaskLog} log
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    */
	    createLog(log: TaskAgentInterfaces.TaskLog, scopeIdentifier: string, hubName: string, planId: string): Q.Promise<TaskAgentInterfaces.TaskLog>;
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    * @param {number} logId
	    * @param {number} startLine
	    * @param {number} endLine
	    */
	    getLog(scopeIdentifier: string, hubName: string, planId: string, logId: number, startLine?: number, endLine?: number): Q.Promise<string[]>;
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    */
	    getLogs(scopeIdentifier: string, hubName: string, planId: string): Q.Promise<TaskAgentInterfaces.TaskLog[]>;
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    */
	    getPlan(scopeIdentifier: string, hubName: string, planId: string): Q.Promise<TaskAgentInterfaces.TaskOrchestrationPlan>;
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    * @param {string} timelineId
	    * @param {number} changeId
	    */
	    getRecords(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, changeId?: number): Q.Promise<TaskAgentInterfaces.TimelineRecord[]>;
	    /**
	    * @param {VSSInterfaces.VssJsonCollectionWrapperV<TaskAgentInterfaces.TimelineRecord[]>} records
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    * @param {string} timelineId
	    */
	    updateRecords(records: VSSInterfaces.VssJsonCollectionWrapperV<TaskAgentInterfaces.TimelineRecord[]>, scopeIdentifier: string, hubName: string, planId: string, timelineId: string): Q.Promise<TaskAgentInterfaces.TimelineRecord[]>;
	    /**
	    * @param {TaskAgentInterfaces.Timeline} timeline
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    */
	    createTimeline(timeline: TaskAgentInterfaces.Timeline, scopeIdentifier: string, hubName: string, planId: string): Q.Promise<TaskAgentInterfaces.Timeline>;
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    * @param {string} timelineId
	    */
	    deleteTimeline(scopeIdentifier: string, hubName: string, planId: string, timelineId: string): Q.Promise<void>;
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    * @param {string} timelineId
	    * @param {number} changeId
	    * @param {boolean} includeRecords
	    */
	    getTimeline(scopeIdentifier: string, hubName: string, planId: string, timelineId: string, changeId?: number, includeRecords?: boolean): Q.Promise<TaskAgentInterfaces.Timeline>;
	    /**
	    * @param {string} scopeIdentifier - The project GUID to scope the request
	    * @param {string} hubName - The name of the server hub: "build" for the Build server or "rm" for the Release Management server
	    * @param {string} planId
	    */
	    getTimelines(scopeIdentifier: string, hubName: string, planId: string): Q.Promise<TaskAgentInterfaces.Timeline[]>;
	}

}
declare module 'vso-node-api/interfaces/TestInterfaces' {
	import TfsCoreInterfaces = require('vso-node-api/interfaces/CoreInterfaces');
	import VSSInterfaces = require('vso-node-api/interfaces/common/VSSInterfaces');
	export interface AggregatedDataForResultTrend {
	    /**
	     * This is tests execution duration.
	     */
	    duration: any;
	    resultsByOutcome: {
	        [key: number]: AggregatedResultsByOutcome;
	    };
	    testResultsContext: TestResultsContext;
	}
	export interface AggregatedResultsAnalysis {
	    duration: any;
	    previousContext: TestResultsContext;
	    resultsByOutcome: {
	        [key: number]: AggregatedResultsByOutcome;
	    };
	    resultsDifference: AggregatedResultsDifference;
	    totalTests: number;
	}
	export interface AggregatedResultsByOutcome {
	    count: number;
	    duration: any;
	    outcome: TestOutcome;
	}
	export interface AggregatedResultsDifference {
	    increaseInDuration: any;
	    increaseInFailures: number;
	    increaseInPassedTests: number;
	    increaseInTotalTests: number;
	}
	export enum AttachmentType {
	    GeneralAttachment = 0,
	    AfnStrip = 1,
	    BugFilingData = 2,
	    CodeCoverage = 3,
	    IntermediateCollectorData = 4,
	    RunConfig = 5,
	    TestImpactDetails = 6,
	    TmiTestRunDeploymentFiles = 7,
	    TmiTestRunReverseDeploymentFiles = 8,
	    TmiTestResultDetail = 9,
	    TmiTestRunSummary = 10,
	}
	export interface BatchResponse {
	    error: string;
	    responses: Response[];
	    status: string;
	}
	export interface BuildConfiguration {
	    branchName: string;
	    buildDefinitionId: number;
	    flavor: string;
	    id: number;
	    number: string;
	    platform: string;
	    project: ShallowReference;
	    repositoryId: number;
	    sourceVersion: string;
	    uri: string;
	}
	export interface BuildCoverage {
	    codeCoverageFileUrl: string;
	    configuration: BuildConfiguration;
	    lastError: string;
	    modules: ModuleCoverage[];
	    state: string;
	}
	export interface BuildReference {
	    branchName: string;
	    buildSystem: string;
	    definitionId: number;
	    id: number;
	    number: string;
	    uri: string;
	}
	export interface CloneOperationInformation {
	    cloneStatistics: CloneStatistics;
	    /**
	     * If the operation is complete, the DateTime of completion. If operation is not complete, this is DateTime.MaxValue
	     */
	    completionDate: Date;
	    /**
	     * DateTime when the operation was started
	     */
	    creationDate: Date;
	    /**
	     * Shallow reference of the destination
	     */
	    destinationObject: ShallowReference;
	    /**
	     * Shallow reference of the destination
	     */
	    destinationPlan: ShallowReference;
	    /**
	     * Shallow reference of the destination
	     */
	    destinationProject: ShallowReference;
	    /**
	     * If the operation has Failed, Message contains the reason for failure. Null otherwise.
	     */
	    message: string;
	    /**
	     * The ID of the operation
	     */
	    opId: number;
	    /**
	     * The type of the object generated as a result of the Clone operation
	     */
	    resultObjectType: ResultObjectType;
	    /**
	     * Shallow reference of the source
	     */
	    sourceObject: ShallowReference;
	    /**
	     * Shallow reference of the source
	     */
	    sourcePlan: ShallowReference;
	    /**
	     * Shallow reference of the source
	     */
	    sourceProject: ShallowReference;
	    /**
	     * Current state of the operation. When State reaches Suceeded or Failed, the operation is complete
	     */
	    state: CloneOperationState;
	    /**
	     * Url for geting the clone information
	     */
	    url: string;
	}
	export enum CloneOperationState {
	    Failed = 2,
	    InProgress = 1,
	    Queued = 0,
	    Succeeded = 3,
	}
	export interface CloneOptions {
	    /**
	     * If set to true requirements will be cloned
	     */
	    cloneRequirements: boolean;
	    /**
	     * copy all suites from a source plan
	     */
	    copyAllSuites: boolean;
	    /**
	     * copy ancestor hieracrchy
	     */
	    copyAncestorHierarchy: boolean;
	    /**
	     * Name of the workitem type of the clone
	     */
	    destinationWorkItemType: string;
	    /**
	     * Key value pairs where the key value is overridden by the value.
	     */
	    overrideParameters: {
	        [key: string]: string;
	    };
	    /**
	     * Comment on the link that will link the new clone  test case to the original Set null for no comment
	     */
	    relatedLinkComment: string;
	}
	export interface CloneStatistics {
	    /**
	     * Number of Requirments cloned so far.
	     */
	    clonedRequirementsCount: number;
	    /**
	     * Number of shared steps cloned so far.
	     */
	    clonedSharedStepsCount: number;
	    /**
	     * Number of test cases cloned so far
	     */
	    clonedTestCasesCount: number;
	    /**
	     * Total number of requirements to be cloned
	     */
	    totalRequirementsCount: number;
	    /**
	     * Total number of test cases to be cloned
	     */
	    totalTestCasesCount: number;
	}
	/**
	 * Represents the build configuration (platform, flavor) and coverage data for the build
	 */
	export interface CodeCoverageData {
	    /**
	     * Flavor of build for which data is retrieved/published
	     */
	    buildFlavor: string;
	    /**
	     * Platform of build for which data is retrieved/published
	     */
	    buildPlatform: string;
	    /**
	     * List of coverage data for the build
	     */
	    coverageStats: CodeCoverageStatistics[];
	}
	/**
	 * Represents the code coverage statistics for a particular coverage label (modules, statements, blocks, etc.)
	 */
	export interface CodeCoverageStatistics {
	    /**
	     * Covered units
	     */
	    covered: number;
	    /**
	     * Delta of coverage
	     */
	    delta: number;
	    /**
	     * Is delta valid
	     */
	    isDeltaAvailable: boolean;
	    /**
	     * Label of coverage data ("Blocks", "Statements", "Modules", etc.)
	     */
	    label: string;
	    /**
	     * Position of label
	     */
	    position: number;
	    /**
	     * Total units
	     */
	    total: number;
	}
	/**
	 * Represents the code coverage summary results Used to publish or retrieve code coverage summary against a build
	 */
	export interface CodeCoverageSummary {
	    /**
	     * Uri of build for which data is retrieved/published
	     */
	    build: ShallowReference;
	    /**
	     * List of coverage data and details for the build
	     */
	    coverageData: CodeCoverageData[];
	    /**
	     * Uri of build against which difference in coverage is computed
	     */
	    deltaBuild: ShallowReference;
	}
	export enum CoverageQueryFlags {
	    /**
	     * If set, the Coverage.Modules property will be populated.
	     */
	    Modules = 1,
	    /**
	     * If set, the ModuleCoverage.Functions properties will be populated.
	     */
	    Functions = 2,
	    /**
	     * If set, the ModuleCoverage.CoverageData field will be populated.
	     */
	    BlockData = 4,
	}
	export interface CoverageStatistics {
	    blocksCovered: number;
	    blocksNotCovered: number;
	    linesCovered: number;
	    linesNotCovered: number;
	    linesPartiallyCovered: number;
	}
	export interface CustomTestField {
	    fieldName: string;
	    value: any;
	}
	export interface CustomTestFieldDefinition {
	    fieldId: number;
	    fieldName: string;
	    fieldType: CustomTestFieldType;
	    scope: CustomTestFieldScope;
	}
	export enum CustomTestFieldScope {
	    None = 0,
	    TestRun = 1,
	    TestResult = 2,
	    System = 4,
	    All = 7,
	}
	export enum CustomTestFieldType {
	    Bit = 2,
	    DateTime = 4,
	    Int = 8,
	    Float = 6,
	    String = 12,
	    Guid = 14,
	}
	/**
	 * This is a temporary class to provide the details for the test run environment.
	 */
	export interface DtlEnvironmentDetails {
	    csmContent: string;
	    csmParameters: string;
	    subscriptionName: string;
	}
	export interface FailingSince {
	    build: BuildReference;
	    date: Date;
	    release: ReleaseReference;
	}
	export interface FunctionCoverage {
	    class: string;
	    name: string;
	    namespace: string;
	    sourceFile: string;
	    statistics: CoverageStatistics;
	}
	export enum GroupTestResultsBy {
	    None = 0,
	    AutomatedTestStorage = 1,
	}
	export interface LastResultDetails {
	    dateCompleted: Date;
	    duration: number;
	    runBy: VSSInterfaces.IdentityRef;
	}
	export interface ModuleCoverage {
	    blockCount: number;
	    blockData: number[];
	    functions: FunctionCoverage[];
	    name: string;
	    signature: string;
	    signatureAge: number;
	    statistics: CoverageStatistics;
	}
	export interface NameValuePair {
	    name: string;
	    value: string;
	}
	export interface PlanUpdateModel {
	    area: ShallowReference;
	    automatedTestEnvironment: TestEnvironment;
	    automatedTestSettings: TestSettings;
	    build: ShallowReference;
	    configurationIds: number[];
	    description: string;
	    endDate: string;
	    iteration: string;
	    manualTestEnvironment: TestEnvironment;
	    manualTestSettings: TestSettings;
	    name: string;
	    owner: VSSInterfaces.IdentityRef;
	    startDate: string;
	    state: string;
	    status: string;
	}
	export interface PointAssignment {
	    configuration: ShallowReference;
	    tester: VSSInterfaces.IdentityRef;
	}
	export interface PointUpdateModel {
	}
	export interface PointWorkItemProperty {
	    workItem: {
	        key: string;
	        value: any;
	    };
	}
	export interface QueryModel {
	    query: string;
	}
	export interface ReleaseReference {
	    definitionId: number;
	    environmentDefinitionId: number;
	    environmentId: number;
	    id: number;
	}
	export interface Response {
	    error: string;
	    id: string;
	    status: string;
	    url: string;
	}
	export enum ResultDetails {
	    None = 0,
	    Iterations = 1,
	    WorkItems = 2,
	}
	export enum ResultObjectType {
	    TestSuite = 0,
	    TestPlan = 1,
	}
	export enum ResultOutcome {
	    Pass = 1,
	    Fail = 2,
	    Pending = 3,
	}
	export interface ResultRetentionSettings {
	    automatedResultsRetentionDuration: number;
	    lastUpdatedBy: VSSInterfaces.IdentityRef;
	    lastUpdatedDate: Date;
	    manualResultsRetentionDuration: number;
	}
	export interface ResultUpdateRequestModel {
	    actionResultDeletes: TestActionResultModel[];
	    actionResults: TestActionResultModel[];
	    parameterDeletes: TestResultParameterModel[];
	    parameters: TestResultParameterModel[];
	    testCaseResult: TestCaseResultUpdateModel;
	}
	export interface ResultUpdateResponseModel {
	    revision: number;
	}
	export interface RunCreateModel {
	    automated: boolean;
	    build: ShallowReference;
	    buildDropLocation: string;
	    buildFlavor: string;
	    buildPlatform: string;
	    comment: string;
	    completeDate: string;
	    configurationIds: number[];
	    controller: string;
	    customTestFields: CustomTestField[];
	    dtlAutEnvironment: ShallowReference;
	    dtlTestEnvironment: ShallowReference;
	    dueDate: string;
	    environmentDetails: DtlEnvironmentDetails;
	    errorMessage: string;
	    filter: RunFilter;
	    iteration: string;
	    name: string;
	    owner: VSSInterfaces.IdentityRef;
	    plan: ShallowReference;
	    pointIds: number[];
	    releaseEnvironmentUri: string;
	    releaseUri: string;
	    runTimeout: any;
	    sourceWorkflow: string;
	    startDate: string;
	    state: string;
	    testConfigurationsMapping: string;
	    testEnvironmentId: string;
	    testSettings: ShallowReference;
	    type: string;
	}
	/**
	 * This class is used to provide the filters used for discovery
	 */
	export interface RunFilter {
	    /**
	     * filter for the test case sources (test containers)
	     */
	    sourceFilter: string;
	    /**
	     * filter for the test cases
	     */
	    testCaseFilter: string;
	}
	export interface RunStatistic {
	    count: number;
	    outcome: string;
	    resolutionState: TestResolutionState;
	    state: string;
	}
	export interface RunUpdateModel {
	    build: ShallowReference;
	    comment: string;
	    completedDate: string;
	    controller: string;
	    deleteInProgressResults: boolean;
	    dtlAutEnvironment: ShallowReference;
	    dtlEnvironment: ShallowReference;
	    dtlEnvironmentDetails: DtlEnvironmentDetails;
	    dueDate: string;
	    errorMessage: string;
	    iteration: string;
	    logEntries: TestMessageLogDetails[];
	    name: string;
	    startedDate: string;
	    state: string;
	    substate: TestRunSubstate;
	    testEnvironmentId: string;
	    testSettings: ShallowReference;
	}
	/**
	 * An abstracted reference to some other resource. This class is used to provide the build data contracts with a uniform way to reference other resources in a way that provides easy traversal through links.
	 */
	export interface ShallowReference {
	    /**
	     * Id of the resource
	     */
	    id: string;
	    /**
	     * Name of the linked resource (definition name, controller name, etc.)
	     */
	    name: string;
	    /**
	     * Full http link to the resource
	     */
	    url: string;
	}
	export interface SharedStepModel {
	    id: number;
	    revision: number;
	}
	export interface SuiteCreateModel {
	}
	export interface SuiteTestCase {
	    pointAssignments: PointAssignment[];
	    testCase: WorkItemReference;
	}
	export interface SuiteUpdateModel {
	}
	export interface TestActionResultModel extends TestResultModelBase {
	    actionPath: string;
	    iterationId: number;
	    sharedStepModel: SharedStepModel;
	    url: string;
	}
	export interface TestAttachmentReference {
	    id: number;
	    url: string;
	}
	export interface TestAttachmentRequestModel {
	    attachmentType: string;
	    comment: string;
	    fileName: string;
	    stream: string;
	}
	export interface TestCaseResult {
	    afnStripId: number;
	    area: ShallowReference;
	    associatedBugs: ShallowReference[];
	    automatedTestId: string;
	    automatedTestName: string;
	    automatedTestStorage: string;
	    automatedTestType: string;
	    automatedTestTypeId: string;
	    build: ShallowReference;
	    buildReference: BuildReference;
	    comment: string;
	    completedDate: Date;
	    computerName: string;
	    configuration: ShallowReference;
	    createdDate: Date;
	    customFields: CustomTestField[];
	    durationInMs: number;
	    errorMessage: string;
	    failingSince: FailingSince;
	    failureType: string;
	    id: number;
	    iterationDetails: TestIterationDetailsModel[];
	    lastUpdatedBy: VSSInterfaces.IdentityRef;
	    lastUpdatedDate: Date;
	    outcome: string;
	    owner: VSSInterfaces.IdentityRef;
	    priority: number;
	    project: ShallowReference;
	    releaseReference: ReleaseReference;
	    resetCount: number;
	    resolutionState: string;
	    resolutionStateId: number;
	    revision: number;
	    runBy: VSSInterfaces.IdentityRef;
	    stackTrace: string;
	    startedDate: Date;
	    state: string;
	    testCase: ShallowReference;
	    testCaseTitle: string;
	    testPoint: ShallowReference;
	    testRun: ShallowReference;
	    url: string;
	}
	export interface TestCaseResult2 {
	    componentId: string;
	    custom: any;
	    endTime: Date;
	    exceptionStack: string;
	    externalArtifacts: string[];
	    externalRunId: string;
	    externalSystem: string;
	    externalTestId: string;
	    failureReasons: string[];
	    failureSummary: string;
	    investigationNotes: string;
	    isSuperseded: boolean;
	    isValid: boolean;
	    outcome: ResultOutcome;
	    resultCustomPropertiesTypeName: string;
	    resultId: string;
	    resultName: string;
	    runId: string;
	    startTime: Date;
	    testId: string;
	    tfsSecurityKey: string;
	}
	export interface TestCaseResultAttachmentModel {
	    id: number;
	    iterationId: number;
	    name: string;
	    size: number;
	    url: string;
	}
	export interface TestCaseResultIdentifier {
	    testResultId: number;
	    testRunId: number;
	}
	export interface TestCaseResultUpdateModel {
	    associatedWorkItems: number[];
	    automatedTestTypeId: string;
	    comment: string;
	    completedDate: string;
	    computerName: string;
	    customFields: CustomTestField[];
	    durationInMs: string;
	    errorMessage: string;
	    failureType: string;
	    outcome: string;
	    owner: VSSInterfaces.IdentityRef;
	    resolutionState: string;
	    runBy: VSSInterfaces.IdentityRef;
	    stackTrace: string;
	    startedDate: string;
	    state: string;
	    testCasePriority: string;
	    testResult: ShallowReference;
	}
	export interface TestConfiguration {
	    /**
	     * Area of the configuration
	     */
	    area: ShallowReference;
	    /**
	     * Description of the configuration
	     */
	    description: string;
	    /**
	     * Id of the configuration
	     */
	    id: number;
	    /**
	     * Is the configuration a default for the test plans
	     */
	    isDefault: boolean;
	    /**
	     * Last Updated By  Reference
	     */
	    lastUpdatedBy: VSSInterfaces.IdentityRef;
	    /**
	     * Last Updated Data
	     */
	    lastUpdatedDate: Date;
	    /**
	     * Name of the configuration
	     */
	    name: string;
	    /**
	     * Project to which the configuration belongs
	     */
	    project: ShallowReference;
	    /**
	     * Revision of the the configuration
	     */
	    revision: number;
	    /**
	     * State of the configuration
	     */
	    state: TestConfigurationState;
	    /**
	     * Url of Configuration Resource
	     */
	    url: string;
	    /**
	     * Dictionary of Test Variable, Selected Value
	     */
	    values: NameValuePair[];
	}
	export enum TestConfigurationState {
	    /**
	     * The configuration can be used for new test runs.
	     */
	    Active = 1,
	    /**
	     * The configuration has been retired and should not be used for new test runs.
	     */
	    Inactive = 2,
	}
	export interface TestEnvironment {
	    environmentId: string;
	    environmentName: string;
	}
	export interface TestFailureDetails {
	    count: number;
	    testResults: ShallowReference[];
	}
	export interface TestFailuresAnalysis {
	    existingFailures: TestFailureDetails;
	    fixedTests: TestFailureDetails;
	    newFailures: TestFailureDetails;
	    previousContext: TestResultsContext;
	}
	export interface TestIterationDetailsModel {
	    actionResults: TestActionResultModel[];
	    attachments: TestCaseResultAttachmentModel[];
	    comment: string;
	    completedDate: Date;
	    durationInMs: number;
	    errorMessage: string;
	    id: number;
	    outcome: string;
	    parameters: TestResultParameterModel[];
	    startedDate: Date;
	    url: string;
	}
	/**
	 * An abstracted reference to some other resource. This class is used to provide the build data contracts with a uniform way to reference other resources in a way that provides easy traversal through links.
	 */
	export interface TestMessageLogDetails {
	    /**
	     * Date when the resource is created
	     */
	    dateCreated: Date;
	    /**
	     * Id of the resource
	     */
	    entryId: number;
	    /**
	     * Message of the resource
	     */
	    message: string;
	}
	export enum TestOutcome {
	    /**
	     * Only used during an update to preserve the existing value.
	     */
	    Unspecified = 0,
	    /**
	     * Test has not been completed, or the test type does not report pass/failure.
	     */
	    None = 1,
	    /**
	     * Test was executed w/o any issues.
	     */
	    Passed = 2,
	    /**
	     * Test was executed, but there were issues. Issues may involve exceptions or failed assertions.
	     */
	    Failed = 3,
	    /**
	     * Test has completed, but we can't say if it passed or failed. May be used for aborted tests...
	     */
	    Inconclusive = 4,
	    /**
	     * The test timed out
	     */
	    Timeout = 5,
	    /**
	     * Test was aborted. This was not caused by a user gesture, but rather by a framework decision.
	     */
	    Aborted = 6,
	    /**
	     * Test had it chance for been executed but was not, as ITestElement.IsRunnable == false.
	     */
	    Blocked = 7,
	    /**
	     * Test was not executed. This was caused by a user gesture - e.g. user hit stop button.
	     */
	    NotExecuted = 8,
	    /**
	     * To be used by Run level results. This is not a failure.
	     */
	    Warning = 9,
	    /**
	     * There was a system error while we were trying to execute a test.
	     */
	    Error = 10,
	    /**
	     * Test is Not Applicable for execution.
	     */
	    NotApplicable = 11,
	    /**
	     * Test is paused.
	     */
	    Paused = 12,
	    /**
	     * Test is currently executing. Added this for TCM charts
	     */
	    InProgress = 13,
	    MaxValue = 13,
	}
	export interface TestPlan {
	    area: ShallowReference;
	    automatedTestEnvironment: TestEnvironment;
	    automatedTestSettings: TestSettings;
	    build: ShallowReference;
	    clientUrl: string;
	    description: string;
	    endDate: Date;
	    id: number;
	    iteration: string;
	    manualTestEnvironment: TestEnvironment;
	    manualTestSettings: TestSettings;
	    name: string;
	    owner: VSSInterfaces.IdentityRef;
	    previousBuild: ShallowReference;
	    project: ShallowReference;
	    revision: number;
	    rootSuite: ShallowReference;
	    startDate: Date;
	    state: string;
	    updatedBy: VSSInterfaces.IdentityRef;
	    updatedDate: Date;
	    url: string;
	}
	export interface TestPlanCloneRequest {
	    cloneOptions: CloneOptions;
	    destinationTestPlan: TestPlan;
	    suiteIds: number[];
	}
	export interface TestPlansWithSelection {
	    lastSelectedPlan: number;
	    lastSelectedSuite: number;
	    plans: TestPlan[];
	}
	export interface TestPoint {
	    assignedTo: VSSInterfaces.IdentityRef;
	    automated: boolean;
	    comment: string;
	    configuration: ShallowReference;
	    failureType: string;
	    id: number;
	    lastResolutionStateId: number;
	    lastResult: ShallowReference;
	    lastResultDetails: LastResultDetails;
	    lastRunBuildNumber: string;
	    lastTestRun: ShallowReference;
	    lastUpdatedBy: VSSInterfaces.IdentityRef;
	    lastUpdatedDate: Date;
	    outcome: string;
	    revision: number;
	    state: string;
	    suite: ShallowReference;
	    testCase: WorkItemReference;
	    testPlan: ShallowReference;
	    url: string;
	    workItemProperties: any[];
	}
	export interface TestResolutionState {
	    id: number;
	    name: string;
	    project: ShallowReference;
	}
	export interface TestResultCreateModel {
	    area: ShallowReference;
	    associatedWorkItems: number[];
	    automatedTestId: string;
	    automatedTestName: string;
	    automatedTestStorage: string;
	    automatedTestType: string;
	    automatedTestTypeId: string;
	    comment: string;
	    completedDate: string;
	    computerName: string;
	    configuration: ShallowReference;
	    customFields: CustomTestField[];
	    durationInMs: string;
	    errorMessage: string;
	    failureType: string;
	    outcome: string;
	    owner: VSSInterfaces.IdentityRef;
	    resolutionState: string;
	    runBy: VSSInterfaces.IdentityRef;
	    stackTrace: string;
	    startedDate: string;
	    state: string;
	    testCase: ShallowReference;
	    testCasePriority: string;
	    testCaseTitle: string;
	    testPoint: ShallowReference;
	}
	export interface TestResultModelBase {
	    comment: string;
	    completedDate: Date;
	    durationInMs: number;
	    errorMessage: string;
	    outcome: string;
	    startedDate: Date;
	}
	export interface TestResultParameterModel {
	    actionPath: string;
	    iterationId: number;
	    parameterName: string;
	    url: string;
	    value: string;
	}
	export interface TestResultsContext {
	    build: BuildReference;
	    contextType: TestResultsContextType;
	    release: ReleaseReference;
	}
	export enum TestResultsContextType {
	    Build = 1,
	    Release = 2,
	}
	export interface TestResultsDetails {
	    groupByField: string;
	    resultsForGroup: TestResultsDetailsForGroup[];
	}
	export interface TestResultsDetailsForGroup {
	    groupByValue: any;
	    ids: TestCaseResultIdentifier[];
	    resultsCountByOutcome: {
	        [key: number]: AggregatedResultsByOutcome;
	    };
	}
	export interface TestResultSummary {
	    aggregatedResultsAnalysis: AggregatedResultsAnalysis;
	    teamProject: TfsCoreInterfaces.TeamProjectReference;
	    testFailures: TestFailuresAnalysis;
	    testResultsContext: TestResultsContext;
	}
	export interface TestResultTrendFilter {
	    branchNames: string[];
	    buildCount: number;
	    definitionIds: number[];
	    publishContext: string;
	    testRunTitles: string[];
	}
	export interface TestRun {
	    build: ShallowReference;
	    buildConfiguration: BuildConfiguration;
	    comment: string;
	    completedDate: Date;
	    controller: string;
	    createdDate: Date;
	    customFields: CustomTestField[];
	    dropLocation: string;
	    dtlAutEnvironment: ShallowReference;
	    dtlEnvironment: ShallowReference;
	    dtlEnvironmentCreationDetails: DtlEnvironmentDetails;
	    dueDate: Date;
	    errorMessage: string;
	    filter: RunFilter;
	    id: number;
	    incompleteTests: number;
	    isAutomated: boolean;
	    iteration: string;
	    lastUpdatedBy: VSSInterfaces.IdentityRef;
	    lastUpdatedDate: Date;
	    name: string;
	    notApplicableTests: number;
	    owner: VSSInterfaces.IdentityRef;
	    passedTests: number;
	    phase: string;
	    plan: ShallowReference;
	    postProcessState: string;
	    project: ShallowReference;
	    releaseEnvironmentUri: string;
	    releaseUri: string;
	    revision: number;
	    runStatistics: RunStatistic[];
	    startedDate: Date;
	    state: string;
	    substate: TestRunSubstate;
	    testEnvironment: TestEnvironment;
	    testMessageLogId: number;
	    testSettings: ShallowReference;
	    totalTests: number;
	    unanalyzedTests: number;
	    url: string;
	    webAccessUrl: string;
	}
	export interface TestRunCoverage {
	    lastError: string;
	    modules: ModuleCoverage[];
	    state: string;
	    testRun: ShallowReference;
	}
	export enum TestRunState {
	    /**
	     * Only used during an update to preserve the existing value.
	     */
	    Unspecified = 0,
	    /**
	     * The run is still being created.  No tests have started yet.
	     */
	    NotStarted = 1,
	    /**
	     * Tests are running.
	     */
	    InProgress = 2,
	    /**
	     * All tests have completed or been skipped.
	     */
	    Completed = 3,
	    /**
	     * Run is stopped and remaing tests have been aborted
	     */
	    Aborted = 4,
	    /**
	     * Run is currently initializing This is a legacy state and should not be used any more
	     */
	    Waiting = 5,
	    /**
	     * Run requires investigation because of a test point failure This is a legacy state and should not be used any more
	     */
	    NeedsInvestigation = 6,
	}
	export interface TestRunStatistic {
	    run: ShallowReference;
	    runStatistics: RunStatistic[];
	}
	export enum TestRunSubstate {
	    None = 0,
	    CreatingEnvironment = 1,
	    RunningTests = 2,
	    CanceledByUser = 3,
	    AbortedBySystem = 4,
	    TimedOut = 5,
	    PendingAnalysis = 6,
	    Analyzed = 7,
	    CancellationInProgress = 8,
	}
	/**
	 * Represents the test settings of the run. Used to create test settings and fetch test settings
	 */
	export interface TestSettings {
	    /**
	     * Area path required to create test settings
	     */
	    areaPath: string;
	    /**
	     * Description of the test settings. Used in create test settings.
	     */
	    description: string;
	    /**
	     * Indicates if the tests settings is public or private.Used in create test settings.
	     */
	    isPublic: boolean;
	    /**
	     * Xml string of machine roles. Used in create test settings.
	     */
	    machineRoles: string;
	    /**
	     * Test settings content.
	     */
	    testSettingsContent: string;
	    /**
	     * Test settings id.
	     */
	    testSettingsId: number;
	    /**
	     * Test settings name.
	     */
	    testSettingsName: string;
	}
	export interface TestSuite {
	    areaUri: string;
	    children: TestSuite[];
	    defaultConfigurations: ShallowReference[];
	    id: number;
	    inheritDefaultConfigurations: boolean;
	    lastError: string;
	    lastPopulatedDate: Date;
	    lastUpdatedBy: VSSInterfaces.IdentityRef;
	    lastUpdatedDate: Date;
	    name: string;
	    parent: ShallowReference;
	    plan: ShallowReference;
	    project: ShallowReference;
	    queryString: string;
	    requirementId: number;
	    revision: number;
	    state: string;
	    suites: ShallowReference[];
	    suiteType: string;
	    testCaseCount: number;
	    testCasesUrl: string;
	    text: string;
	    url: string;
	}
	export interface TestSuiteCloneRequest {
	    cloneOptions: CloneOptions;
	    destinationSuiteId: number;
	    destinationSuiteProjectName: string;
	}
	export interface TestVariable {
	    /**
	     * Description of the test variable
	     */
	    description: string;
	    /**
	     * Id of the test variable
	     */
	    id: number;
	    /**
	     * Name of the test variable
	     */
	    name: string;
	    /**
	     * Project to which the test variable belongs
	     */
	    project: ShallowReference;
	    /**
	     * Revision
	     */
	    revision: number;
	    /**
	     * Url of the test variable
	     */
	    url: string;
	    /**
	     * List of allowed values
	     */
	    values: string[];
	}
	export interface WorkItemReference {
	    id: string;
	    name: string;
	    url: string;
	    webUrl: string;
	}
	export var TypeInfo: {
	    AggregatedDataForResultTrend: {
	        fields: any;
	    };
	    AggregatedResultsAnalysis: {
	        fields: any;
	    };
	    AggregatedResultsByOutcome: {
	        fields: any;
	    };
	    AggregatedResultsDifference: {
	        fields: any;
	    };
	    AttachmentType: {
	        enumValues: {
	            "generalAttachment": number;
	            "afnStrip": number;
	            "bugFilingData": number;
	            "codeCoverage": number;
	            "intermediateCollectorData": number;
	            "runConfig": number;
	            "testImpactDetails": number;
	            "tmiTestRunDeploymentFiles": number;
	            "tmiTestRunReverseDeploymentFiles": number;
	            "tmiTestResultDetail": number;
	            "tmiTestRunSummary": number;
	        };
	    };
	    BatchResponse: {
	        fields: any;
	    };
	    BuildConfiguration: {
	        fields: any;
	    };
	    BuildCoverage: {
	        fields: any;
	    };
	    BuildReference: {
	        fields: any;
	    };
	    CloneOperationInformation: {
	        fields: any;
	    };
	    CloneOperationState: {
	        enumValues: {
	            "failed": number;
	            "inProgress": number;
	            "queued": number;
	            "succeeded": number;
	        };
	    };
	    CloneOptions: {
	        fields: any;
	    };
	    CloneStatistics: {
	        fields: any;
	    };
	    CodeCoverageData: {
	        fields: any;
	    };
	    CodeCoverageStatistics: {
	        fields: any;
	    };
	    CodeCoverageSummary: {
	        fields: any;
	    };
	    CoverageQueryFlags: {
	        enumValues: {
	            "modules": number;
	            "functions": number;
	            "blockData": number;
	        };
	    };
	    CoverageStatistics: {
	        fields: any;
	    };
	    CustomTestField: {
	        fields: any;
	    };
	    CustomTestFieldDefinition: {
	        fields: any;
	    };
	    CustomTestFieldScope: {
	        enumValues: {
	            "none": number;
	            "testRun": number;
	            "testResult": number;
	            "system": number;
	            "all": number;
	        };
	    };
	    CustomTestFieldType: {
	        enumValues: {
	            "bit": number;
	            "dateTime": number;
	            "int": number;
	            "float": number;
	            "string": number;
	            "guid": number;
	        };
	    };
	    DtlEnvironmentDetails: {
	        fields: any;
	    };
	    FailingSince: {
	        fields: any;
	    };
	    FunctionCoverage: {
	        fields: any;
	    };
	    GroupTestResultsBy: {
	        enumValues: {
	            "none": number;
	            "automatedTestStorage": number;
	        };
	    };
	    LastResultDetails: {
	        fields: any;
	    };
	    ModuleCoverage: {
	        fields: any;
	    };
	    NameValuePair: {
	        fields: any;
	    };
	    PlanUpdateModel: {
	        fields: any;
	    };
	    PointAssignment: {
	        fields: any;
	    };
	    PointUpdateModel: {
	        fields: any;
	    };
	    PointWorkItemProperty: {
	        fields: any;
	    };
	    QueryModel: {
	        fields: any;
	    };
	    ReleaseReference: {
	        fields: any;
	    };
	    Response: {
	        fields: any;
	    };
	    ResultDetails: {
	        enumValues: {
	            "none": number;
	            "iterations": number;
	            "workItems": number;
	        };
	    };
	    ResultObjectType: {
	        enumValues: {
	            "testSuite": number;
	            "testPlan": number;
	        };
	    };
	    ResultOutcome: {
	        enumValues: {
	            "pass": number;
	            "fail": number;
	            "pending": number;
	        };
	    };
	    ResultRetentionSettings: {
	        fields: any;
	    };
	    ResultUpdateRequestModel: {
	        fields: any;
	    };
	    ResultUpdateResponseModel: {
	        fields: any;
	    };
	    RunCreateModel: {
	        fields: any;
	    };
	    RunFilter: {
	        fields: any;
	    };
	    RunStatistic: {
	        fields: any;
	    };
	    RunUpdateModel: {
	        fields: any;
	    };
	    ShallowReference: {
	        fields: any;
	    };
	    SharedStepModel: {
	        fields: any;
	    };
	    SuiteCreateModel: {
	        fields: any;
	    };
	    SuiteTestCase: {
	        fields: any;
	    };
	    SuiteUpdateModel: {
	        fields: any;
	    };
	    TestActionResultModel: {
	        fields: any;
	    };
	    TestAttachmentReference: {
	        fields: any;
	    };
	    TestAttachmentRequestModel: {
	        fields: any;
	    };
	    TestCaseResult: {
	        fields: any;
	    };
	    TestCaseResult2: {
	        fields: any;
	    };
	    TestCaseResultAttachmentModel: {
	        fields: any;
	    };
	    TestCaseResultIdentifier: {
	        fields: any;
	    };
	    TestCaseResultUpdateModel: {
	        fields: any;
	    };
	    TestConfiguration: {
	        fields: any;
	    };
	    TestConfigurationState: {
	        enumValues: {
	            "active": number;
	            "inactive": number;
	        };
	    };
	    TestEnvironment: {
	        fields: any;
	    };
	    TestFailureDetails: {
	        fields: any;
	    };
	    TestFailuresAnalysis: {
	        fields: any;
	    };
	    TestIterationDetailsModel: {
	        fields: any;
	    };
	    TestMessageLogDetails: {
	        fields: any;
	    };
	    TestOutcome: {
	        enumValues: {
	            "unspecified": number;
	            "none": number;
	            "passed": number;
	            "failed": number;
	            "inconclusive": number;
	            "timeout": number;
	            "aborted": number;
	            "blocked": number;
	            "notExecuted": number;
	            "warning": number;
	            "error": number;
	            "notApplicable": number;
	            "paused": number;
	            "inProgress": number;
	            "maxValue": number;
	        };
	    };
	    TestPlan: {
	        fields: any;
	    };
	    TestPlanCloneRequest: {
	        fields: any;
	    };
	    TestPlansWithSelection: {
	        fields: any;
	    };
	    TestPoint: {
	        fields: any;
	    };
	    TestResolutionState: {
	        fields: any;
	    };
	    TestResultCreateModel: {
	        fields: any;
	    };
	    TestResultModelBase: {
	        fields: any;
	    };
	    TestResultParameterModel: {
	        fields: any;
	    };
	    TestResultsContext: {
	        fields: any;
	    };
	    TestResultsContextType: {
	        enumValues: {
	            "build": number;
	            "release": number;
	        };
	    };
	    TestResultsDetails: {
	        fields: any;
	    };
	    TestResultsDetailsForGroup: {
	        fields: any;
	    };
	    TestResultSummary: {
	        fields: any;
	    };
	    TestResultTrendFilter: {
	        fields: any;
	    };
	    TestRun: {
	        fields: any;
	    };
	    TestRunCoverage: {
	        fields: any;
	    };
	    TestRunState: {
	        enumValues: {
	            "unspecified": number;
	            "notStarted": number;
	            "inProgress": number;
	            "completed": number;
	            "aborted": number;
	            "waiting": number;
	            "needsInvestigation": number;
	        };
	    };
	    TestRunStatistic: {
	        fields: any;
	    };
	    TestRunSubstate: {
	        enumValues: {
	            "none": number;
	            "creatingEnvironment": number;
	            "runningTests": number;
	            "canceledByUser": number;
	            "abortedBySystem": number;
	            "timedOut": number;
	            "pendingAnalysis": number;
	            "analyzed": number;
	            "cancellationInProgress": number;
	        };
	    };
	    TestSettings: {
	        fields: any;
	    };
	    TestSuite: {
	        fields: any;
	    };
	    TestSuiteCloneRequest: {
	        fields: any;
	    };
	    TestVariable: {
	        fields: any;
	    };
	    WorkItemReference: {
	        fields: any;
	    };
	};

}
declare module 'vso-node-api/TestApi' {
	/// <reference path="../node/node.d.ts" />
	/// <reference path="../q/Q.d.ts" />
	import Q = require('q');
	import basem = require('vso-node-api/ClientApiBases');
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	import TestInterfaces = require('vso-node-api/interfaces/TestInterfaces');
	export interface ITestApi extends basem.ClientApiBase {
	    createTestResultAttachment(attachmentRequestModel: TestInterfaces.TestAttachmentRequestModel, project: string, runId: number, testCaseResultId: number, onResult: (err: any, statusCode: number, Attachment: TestInterfaces.TestAttachmentReference) => void): void;
	    getTestResultAttachmentContent(project: string, runId: number, testCaseResultId: number, attachmentId: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getTestResultAttachmentZip(project: string, runId: number, testCaseResultId: number, attachmentId: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    createTestRunAttachment(attachmentRequestModel: TestInterfaces.TestAttachmentRequestModel, project: string, runId: number, onResult: (err: any, statusCode: number, Attachment: TestInterfaces.TestAttachmentReference) => void): void;
	    getTestRunAttachmentContent(project: string, runId: number, attachmentId: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getTestRunAttachmentZip(project: string, runId: number, attachmentId: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getBugsLinkedToTestResult(project: string, runId: number, testCaseResultId: number, onResult: (err: any, statusCode: number, Bugs: TestInterfaces.WorkItemReference[]) => void): void;
	    getBuildCodeCoverage(project: string, buildId: number, flags: number, onResult: (err: any, statusCode: number, CodeCoverage: TestInterfaces.BuildCoverage[]) => void): void;
	    getCodeCoverageSummary(project: string, buildId: number, deltaBuildId: number, onResult: (err: any, statusCode: number, CodeCoverage: TestInterfaces.CodeCoverageSummary) => void): void;
	    updateCodeCoverageSummary(coverageData: TestInterfaces.CodeCoverageData, project: string, buildId: number, onResult: (err: any, statusCode: number) => void): void;
	    getTestRunCodeCoverage(project: string, runId: number, flags: number, onResult: (err: any, statusCode: number, CodeCoverage: TestInterfaces.TestRunCoverage[]) => void): void;
	    createTestConfiguration(testConfiguration: TestInterfaces.TestConfiguration, project: string, onResult: (err: any, statusCode: number, Configuration: TestInterfaces.TestConfiguration) => void): void;
	    deleteTestConfiguration(project: string, testConfigurationId: number, onResult: (err: any, statusCode: number) => void): void;
	    getTestConfigurationById(project: string, testConfigurationId: number, onResult: (err: any, statusCode: number, Configuration: TestInterfaces.TestConfiguration) => void): void;
	    getTestConfigurations(project: string, skip: number, top: number, includeAllProperties: boolean, onResult: (err: any, statusCode: number, Configurations: TestInterfaces.TestConfiguration[]) => void): void;
	    updateTestConfiguration(testConfiguration: TestInterfaces.TestConfiguration, project: string, testConfigurationId: number, onResult: (err: any, statusCode: number, Configuration: TestInterfaces.TestConfiguration) => void): void;
	    addCustomFields(newFields: TestInterfaces.CustomTestFieldDefinition[], project: string, onResult: (err: any, statusCode: number, ExtensionFields: TestInterfaces.CustomTestFieldDefinition[]) => void): void;
	    queryCustomFields(project: string, scopeFilter: TestInterfaces.CustomTestFieldScope, onResult: (err: any, statusCode: number, ExtensionFields: TestInterfaces.CustomTestFieldDefinition[]) => void): void;
	    getTestRunLogs(project: string, runId: number, onResult: (err: any, statusCode: number, MessageLogs: TestInterfaces.TestMessageLogDetails[]) => void): void;
	    getPlanCloneInformation(project: string, operationId: number, includeDetails: boolean, onResult: (err: any, statusCode: number, Plan: TestInterfaces.CloneOperationInformation) => void): void;
	    createTestPlan(testPlan: TestInterfaces.PlanUpdateModel, project: string, onResult: (err: any, statusCode: number, Plan: TestInterfaces.TestPlan) => void): void;
	    deleteTestPlan(project: string, planId: number, onResult: (err: any, statusCode: number) => void): void;
	    getPlanById(project: string, planId: number, onResult: (err: any, statusCode: number, Plan: TestInterfaces.TestPlan) => void): void;
	    getPlans(project: string, owner: string, skip: number, top: number, includePlanDetails: boolean, filterActivePlans: boolean, onResult: (err: any, statusCode: number, Plans: TestInterfaces.TestPlan[]) => void): void;
	    updateTestPlan(planUpdateModel: TestInterfaces.PlanUpdateModel, project: string, planId: number, onResult: (err: any, statusCode: number, Plan: TestInterfaces.TestPlan) => void): void;
	    cloneTestPlan(cloneRequestBody: TestInterfaces.TestPlanCloneRequest, project: string, sourcePlanId: number, onResult: (err: any, statusCode: number, Plan: TestInterfaces.CloneOperationInformation) => void): void;
	    getPoint(project: string, planId: number, suiteId: number, pointIds: number, witFields: string, onResult: (err: any, statusCode: number, Point: TestInterfaces.TestPoint) => void): void;
	    getPoints(project: string, planId: number, suiteId: number, witFields: string, configurationId: string, testCaseId: string, testPointIds: string, includePointDetails: boolean, skip: number, top: number, onResult: (err: any, statusCode: number, Points: TestInterfaces.TestPoint[]) => void): void;
	    updateTestPoints(pointUpdateModel: TestInterfaces.PointUpdateModel, project: string, planId: number, suiteId: number, pointIds: string, onResult: (err: any, statusCode: number, Point: TestInterfaces.TestPoint[]) => void): void;
	    queryTestResultRecentBugs(project: string, testRunId: number, testResultId: number, recentDays: number, onResult: (err: any, statusCode: number, RecentBugs: TestInterfaces.WorkItemReference[]) => void): void;
	    getTestResultDetailsForBuild(project: string, buildId: number, publishContext: string, groupBy: string, filter: string, onResult: (err: any, statusCode: number, ResultDetailsByBuild: TestInterfaces.TestResultsDetails) => void): void;
	    getTestResultDetailsForRelease(project: string, releaseId: number, releaseEnvId: number, publishContext: string, groupBy: string, filter: string, onResult: (err: any, statusCode: number, ResultDetailsByRelease: TestInterfaces.TestResultsDetails) => void): void;
	    createResultRetentionSettings(retentionSettings: TestInterfaces.ResultRetentionSettings, project: string, onResult: (err: any, statusCode: number, ResultRetentionSetting: TestInterfaces.ResultRetentionSettings) => void): void;
	    deleteResultRetentionSettings(project: string, onResult: (err: any, statusCode: number) => void): void;
	    getResultRetentionSettings(project: string, onResult: (err: any, statusCode: number, ResultRetentionSetting: TestInterfaces.ResultRetentionSettings) => void): void;
	    updateResultRetentionSettings(retentionSettings: TestInterfaces.ResultRetentionSettings, project: string, onResult: (err: any, statusCode: number, ResultRetentionSetting: TestInterfaces.ResultRetentionSettings) => void): void;
	    getTestIteration(project: string, runId: number, testCaseResultId: number, iterationId: number, includeActionResults: boolean, onResult: (err: any, statusCode: number, Result: TestInterfaces.TestIterationDetailsModel) => void): void;
	    getTestIterations(project: string, runId: number, testCaseResultId: number, includeActionResults: boolean, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestIterationDetailsModel[]) => void): void;
	    addTestResultsToTestRun(resultCreateModels: TestInterfaces.TestResultCreateModel[], project: string, runId: number, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestCaseResult[]) => void): void;
	    bulkUpdateTestResults(resultUpdateModel: TestInterfaces.TestCaseResultUpdateModel, project: string, runId: number, resultIds: number[], onResult: (err: any, statusCode: number, Result: TestInterfaces.TestCaseResult[]) => void): void;
	    getTestCaseResultById(project: string, runId: number, testCaseResultId: number, includeIterationDetails: boolean, includeAssociatedBugs: boolean, onResult: (err: any, statusCode: number, Result: TestInterfaces.TestCaseResult) => void): void;
	    getTestCaseResults(project: string, runId: number, includeIterationDetails: boolean, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestCaseResult[]) => void): void;
	    getTestResultById(project: string, runId: number, testCaseResultId: number, detailsToInclude: TestInterfaces.ResultDetails, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestCaseResult[]) => void): void;
	    getTestResults(project: string, runId: number, detailsToInclude: TestInterfaces.ResultDetails, skip: number, top: number, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestCaseResult[]) => void): void;
	    updateTestResults(resultUpdateModels: TestInterfaces.TestCaseResultUpdateModel[], project: string, runId: number, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestCaseResult[]) => void): void;
	    getTestResultsByIds(ids: TestInterfaces.TestCaseResultIdentifier[], project: string, fields: string[], onResult: (err: any, statusCode: number, Results: TestInterfaces.TestCaseResult[]) => void): void;
	    getActionResults(project: string, runId: number, testCaseResultId: number, iterationId: number, actionPath: string, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestActionResultModel[]) => void): void;
	    getResultParameters(project: string, runId: number, testCaseResultId: number, iterationId: number, paramName: string, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestResultParameterModel[]) => void): void;
	    getTestResultsByQuery(query: TestInterfaces.QueryModel, project: string, includeResultDetails: boolean, includeIterationDetails: boolean, skip: number, top: number, onResult: (err: any, statusCode: number, Result: TestInterfaces.TestCaseResult[]) => void): void;
	    queryTestResultsReportForBuild(project: string, buildId: number, publishContext: string, includeFailureDetails: boolean, buildToCompare: TestInterfaces.BuildReference, onResult: (err: any, statusCode: number, ResultSummaryByBuild: TestInterfaces.TestResultSummary) => void): void;
	    queryTestResultsReportForRelease(project: string, releaseId: number, releaseEnvId: number, publishContext: string, includeFailureDetails: boolean, releaseToCompare: TestInterfaces.ReleaseReference, onResult: (err: any, statusCode: number, ResultSummaryByRelease: TestInterfaces.TestResultSummary) => void): void;
	    queryTestResultTrendReport(project: string, testRunId: number, testResultId: number, historyDays: number, top: number, onResult: (err: any, statusCode: number, ResultTrend: TestInterfaces.TestCaseResult[]) => void): void;
	    queryResultTrendForBuild(filter: TestInterfaces.TestResultTrendFilter, project: string, onResult: (err: any, statusCode: number, ResultTrendByBuild: TestInterfaces.AggregatedDataForResultTrend[]) => void): void;
	    getTestRunStatistics(project: string, runId: number, onResult: (err: any, statusCode: number, Run: TestInterfaces.TestRunStatistic) => void): void;
	    getTestRunsByQuery(query: TestInterfaces.QueryModel, project: string, includeRunDetails: boolean, skip: number, top: number, onResult: (err: any, statusCode: number, Run: TestInterfaces.TestRun[]) => void): void;
	    createTestRun(testRun: TestInterfaces.RunCreateModel, project: string, onResult: (err: any, statusCode: number, Run: TestInterfaces.TestRun) => void): void;
	    deleteTestRun(project: string, runId: number, onResult: (err: any, statusCode: number) => void): void;
	    getTestRunById(project: string, runId: number, onResult: (err: any, statusCode: number, Run: TestInterfaces.TestRun) => void): void;
	    getTestRuns(project: string, buildUri: string, owner: string, tmiRunId: string, planId: number, includeRunDetails: boolean, automated: boolean, skip: number, top: number, onResult: (err: any, statusCode: number, Runs: TestInterfaces.TestRun[]) => void): void;
	    updateTestRun(runUpdateModel: TestInterfaces.RunUpdateModel, project: string, runId: number, onResult: (err: any, statusCode: number, Run: TestInterfaces.TestRun) => void): void;
	    getSuiteCloneInformation(project: string, operationId: number, includeDetails: boolean, onResult: (err: any, statusCode: number, Suite: TestInterfaces.CloneOperationInformation) => void): void;
	    addTestCasesToSuite(project: string, planId: number, suiteId: number, testCaseIds: string, onResult: (err: any, statusCode: number, Suites: TestInterfaces.SuiteTestCase[]) => void): void;
	    getTestCaseById(project: string, planId: number, suiteId: number, testCaseIds: number, onResult: (err: any, statusCode: number, Suite: TestInterfaces.SuiteTestCase) => void): void;
	    getTestCases(project: string, planId: number, suiteId: number, onResult: (err: any, statusCode: number, Suites: TestInterfaces.SuiteTestCase[]) => void): void;
	    removeTestCasesFromSuiteUrl(project: string, planId: number, suiteId: number, testCaseIds: string, onResult: (err: any, statusCode: number) => void): void;
	    createTestSuite(testSuite: TestInterfaces.SuiteCreateModel, project: string, planId: number, suiteId: number, onResult: (err: any, statusCode: number, Suite: TestInterfaces.TestSuite[]) => void): void;
	    deleteTestSuite(project: string, planId: number, suiteId: number, onResult: (err: any, statusCode: number) => void): void;
	    getTestSuiteById(project: string, planId: number, suiteId: number, includeChildSuites: boolean, onResult: (err: any, statusCode: number, Suite: TestInterfaces.TestSuite) => void): void;
	    getTestSuitesForPlan(project: string, planId: number, includeSuites: boolean, skip: number, top: number, asTreeView: boolean, onResult: (err: any, statusCode: number, Suites: TestInterfaces.TestSuite[]) => void): void;
	    updateTestSuite(suiteUpdateModel: TestInterfaces.SuiteUpdateModel, project: string, planId: number, suiteId: number, onResult: (err: any, statusCode: number, Suite: TestInterfaces.TestSuite) => void): void;
	    cloneTestSuite(cloneRequestBody: TestInterfaces.TestSuiteCloneRequest, project: string, sourceSuiteId: number, planId: number, onResult: (err: any, statusCode: number, Suite: TestInterfaces.CloneOperationInformation) => void): void;
	    getSuitesByTestCaseId(testCaseId: number, onResult: (err: any, statusCode: number, Suites: TestInterfaces.TestSuite[]) => void): void;
	    createTestSettings(testSettings: TestInterfaces.TestSettings, project: string, onResult: (err: any, statusCode: number, TestSetting: number) => void): void;
	    deleteTestSettings(project: string, testSettingsId: number, onResult: (err: any, statusCode: number) => void): void;
	    getTestSettingsById(project: string, testSettingsId: number, onResult: (err: any, statusCode: number, TestSetting: TestInterfaces.TestSettings) => void): void;
	    createTestVariable(testVariable: TestInterfaces.TestVariable, project: string, onResult: (err: any, statusCode: number, Variable: TestInterfaces.TestVariable) => void): void;
	    deleteTestVariable(project: string, testVariableId: number, onResult: (err: any, statusCode: number) => void): void;
	    getTestVariable(project: string, testVariableId: number, onResult: (err: any, statusCode: number, Variable: TestInterfaces.TestVariable) => void): void;
	    getTestVariables(project: string, skip: number, top: number, onResult: (err: any, statusCode: number, Variables: TestInterfaces.TestVariable[]) => void): void;
	    updateTestVariable(testVariable: TestInterfaces.TestVariable, project: string, testVariableId: number, onResult: (err: any, statusCode: number, Variable: TestInterfaces.TestVariable) => void): void;
	}
	export interface IQTestApi extends basem.QClientApiBase {
	    createTestResultAttachment(attachmentRequestModel: TestInterfaces.TestAttachmentRequestModel, project: string, runId: number, testCaseResultId: number): Q.Promise<TestInterfaces.TestAttachmentReference>;
	    getTestResultAttachmentContent(project: string, runId: number, testCaseResultId: number, attachmentId: number): Q.Promise<NodeJS.ReadableStream>;
	    getTestResultAttachmentZip(project: string, runId: number, testCaseResultId: number, attachmentId: number): Q.Promise<NodeJS.ReadableStream>;
	    createTestRunAttachment(attachmentRequestModel: TestInterfaces.TestAttachmentRequestModel, project: string, runId: number): Q.Promise<TestInterfaces.TestAttachmentReference>;
	    getTestRunAttachmentContent(project: string, runId: number, attachmentId: number): Q.Promise<NodeJS.ReadableStream>;
	    getTestRunAttachmentZip(project: string, runId: number, attachmentId: number): Q.Promise<NodeJS.ReadableStream>;
	    getBugsLinkedToTestResult(project: string, runId: number, testCaseResultId: number): Q.Promise<TestInterfaces.WorkItemReference[]>;
	    getBuildCodeCoverage(project: string, buildId: number, flags: number): Q.Promise<TestInterfaces.BuildCoverage[]>;
	    getCodeCoverageSummary(project: string, buildId: number, deltaBuildId?: number): Q.Promise<TestInterfaces.CodeCoverageSummary>;
	    updateCodeCoverageSummary(coverageData: TestInterfaces.CodeCoverageData, project: string, buildId: number): Q.Promise<void>;
	    getTestRunCodeCoverage(project: string, runId: number, flags: number): Q.Promise<TestInterfaces.TestRunCoverage[]>;
	    createTestConfiguration(testConfiguration: TestInterfaces.TestConfiguration, project: string): Q.Promise<TestInterfaces.TestConfiguration>;
	    deleteTestConfiguration(project: string, testConfigurationId: number): Q.Promise<void>;
	    getTestConfigurationById(project: string, testConfigurationId: number): Q.Promise<TestInterfaces.TestConfiguration>;
	    getTestConfigurations(project: string, skip?: number, top?: number, includeAllProperties?: boolean): Q.Promise<TestInterfaces.TestConfiguration[]>;
	    updateTestConfiguration(testConfiguration: TestInterfaces.TestConfiguration, project: string, testConfigurationId: number): Q.Promise<TestInterfaces.TestConfiguration>;
	    addCustomFields(newFields: TestInterfaces.CustomTestFieldDefinition[], project: string): Q.Promise<TestInterfaces.CustomTestFieldDefinition[]>;
	    queryCustomFields(project: string, scopeFilter: TestInterfaces.CustomTestFieldScope): Q.Promise<TestInterfaces.CustomTestFieldDefinition[]>;
	    getTestRunLogs(project: string, runId: number): Q.Promise<TestInterfaces.TestMessageLogDetails[]>;
	    getPlanCloneInformation(project: string, operationId: number, includeDetails?: boolean): Q.Promise<TestInterfaces.CloneOperationInformation>;
	    createTestPlan(testPlan: TestInterfaces.PlanUpdateModel, project: string): Q.Promise<TestInterfaces.TestPlan>;
	    deleteTestPlan(project: string, planId: number): Q.Promise<void>;
	    getPlanById(project: string, planId: number): Q.Promise<TestInterfaces.TestPlan>;
	    getPlans(project: string, owner?: string, skip?: number, top?: number, includePlanDetails?: boolean, filterActivePlans?: boolean): Q.Promise<TestInterfaces.TestPlan[]>;
	    updateTestPlan(planUpdateModel: TestInterfaces.PlanUpdateModel, project: string, planId: number): Q.Promise<TestInterfaces.TestPlan>;
	    cloneTestPlan(cloneRequestBody: TestInterfaces.TestPlanCloneRequest, project: string, sourcePlanId: number): Q.Promise<TestInterfaces.CloneOperationInformation>;
	    getPoint(project: string, planId: number, suiteId: number, pointIds: number, witFields?: string): Q.Promise<TestInterfaces.TestPoint>;
	    getPoints(project: string, planId: number, suiteId: number, witFields?: string, configurationId?: string, testCaseId?: string, testPointIds?: string, includePointDetails?: boolean, skip?: number, top?: number): Q.Promise<TestInterfaces.TestPoint[]>;
	    updateTestPoints(pointUpdateModel: TestInterfaces.PointUpdateModel, project: string, planId: number, suiteId: number, pointIds: string): Q.Promise<TestInterfaces.TestPoint[]>;
	    queryTestResultRecentBugs(project: string, testRunId: number, testResultId: number, recentDays?: number): Q.Promise<TestInterfaces.WorkItemReference[]>;
	    getTestResultDetailsForBuild(project: string, buildId: number, publishContext?: string, groupBy?: string, filter?: string): Q.Promise<TestInterfaces.TestResultsDetails>;
	    getTestResultDetailsForRelease(project: string, releaseId: number, releaseEnvId: number, publishContext?: string, groupBy?: string, filter?: string): Q.Promise<TestInterfaces.TestResultsDetails>;
	    createResultRetentionSettings(retentionSettings: TestInterfaces.ResultRetentionSettings, project: string): Q.Promise<TestInterfaces.ResultRetentionSettings>;
	    deleteResultRetentionSettings(project: string): Q.Promise<void>;
	    getResultRetentionSettings(project: string): Q.Promise<TestInterfaces.ResultRetentionSettings>;
	    updateResultRetentionSettings(retentionSettings: TestInterfaces.ResultRetentionSettings, project: string): Q.Promise<TestInterfaces.ResultRetentionSettings>;
	    getTestIteration(project: string, runId: number, testCaseResultId: number, iterationId: number, includeActionResults?: boolean): Q.Promise<TestInterfaces.TestIterationDetailsModel>;
	    getTestIterations(project: string, runId: number, testCaseResultId: number, includeActionResults?: boolean): Q.Promise<TestInterfaces.TestIterationDetailsModel[]>;
	    addTestResultsToTestRun(resultCreateModels: TestInterfaces.TestResultCreateModel[], project: string, runId: number): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    bulkUpdateTestResults(resultUpdateModel: TestInterfaces.TestCaseResultUpdateModel, project: string, runId: number, resultIds: number[]): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    getTestCaseResultById(project: string, runId: number, testCaseResultId: number, includeIterationDetails: boolean, includeAssociatedBugs?: boolean): Q.Promise<TestInterfaces.TestCaseResult>;
	    getTestCaseResults(project: string, runId: number, includeIterationDetails: boolean): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    getTestResultById(project: string, runId: number, testCaseResultId: number, detailsToInclude?: TestInterfaces.ResultDetails): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    getTestResults(project: string, runId: number, detailsToInclude?: TestInterfaces.ResultDetails, skip?: number, top?: number): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    updateTestResults(resultUpdateModels: TestInterfaces.TestCaseResultUpdateModel[], project: string, runId: number): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    getTestResultsByIds(ids: TestInterfaces.TestCaseResultIdentifier[], project: string, fields: string[]): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    getActionResults(project: string, runId: number, testCaseResultId: number, iterationId: number, actionPath?: string): Q.Promise<TestInterfaces.TestActionResultModel[]>;
	    getResultParameters(project: string, runId: number, testCaseResultId: number, iterationId: number, paramName?: string): Q.Promise<TestInterfaces.TestResultParameterModel[]>;
	    getTestResultsByQuery(query: TestInterfaces.QueryModel, project: string, includeResultDetails?: boolean, includeIterationDetails?: boolean, skip?: number, top?: number): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    queryTestResultsReportForBuild(project: string, buildId: number, publishContext?: string, includeFailureDetails?: boolean, buildToCompare?: TestInterfaces.BuildReference): Q.Promise<TestInterfaces.TestResultSummary>;
	    queryTestResultsReportForRelease(project: string, releaseId: number, releaseEnvId: number, publishContext?: string, includeFailureDetails?: boolean, releaseToCompare?: TestInterfaces.ReleaseReference): Q.Promise<TestInterfaces.TestResultSummary>;
	    queryTestResultTrendReport(project: string, testRunId: number, testResultId: number, historyDays?: number, top?: number): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    queryResultTrendForBuild(filter: TestInterfaces.TestResultTrendFilter, project: string): Q.Promise<TestInterfaces.AggregatedDataForResultTrend[]>;
	    getTestRunStatistics(project: string, runId: number): Q.Promise<TestInterfaces.TestRunStatistic>;
	    getTestRunsByQuery(query: TestInterfaces.QueryModel, project: string, includeRunDetails?: boolean, skip?: number, top?: number): Q.Promise<TestInterfaces.TestRun[]>;
	    createTestRun(testRun: TestInterfaces.RunCreateModel, project: string): Q.Promise<TestInterfaces.TestRun>;
	    deleteTestRun(project: string, runId: number): Q.Promise<void>;
	    getTestRunById(project: string, runId: number): Q.Promise<TestInterfaces.TestRun>;
	    getTestRuns(project: string, buildUri?: string, owner?: string, tmiRunId?: string, planId?: number, includeRunDetails?: boolean, automated?: boolean, skip?: number, top?: number): Q.Promise<TestInterfaces.TestRun[]>;
	    updateTestRun(runUpdateModel: TestInterfaces.RunUpdateModel, project: string, runId: number): Q.Promise<TestInterfaces.TestRun>;
	    getSuiteCloneInformation(project: string, operationId: number, includeDetails?: boolean): Q.Promise<TestInterfaces.CloneOperationInformation>;
	    addTestCasesToSuite(project: string, planId: number, suiteId: number, testCaseIds: string): Q.Promise<TestInterfaces.SuiteTestCase[]>;
	    getTestCaseById(project: string, planId: number, suiteId: number, testCaseIds: number): Q.Promise<TestInterfaces.SuiteTestCase>;
	    getTestCases(project: string, planId: number, suiteId: number): Q.Promise<TestInterfaces.SuiteTestCase[]>;
	    removeTestCasesFromSuiteUrl(project: string, planId: number, suiteId: number, testCaseIds: string): Q.Promise<void>;
	    createTestSuite(testSuite: TestInterfaces.SuiteCreateModel, project: string, planId: number, suiteId: number): Q.Promise<TestInterfaces.TestSuite[]>;
	    deleteTestSuite(project: string, planId: number, suiteId: number): Q.Promise<void>;
	    getTestSuiteById(project: string, planId: number, suiteId: number, includeChildSuites?: boolean): Q.Promise<TestInterfaces.TestSuite>;
	    getTestSuitesForPlan(project: string, planId: number, includeSuites?: boolean, skip?: number, top?: number, asTreeView?: boolean): Q.Promise<TestInterfaces.TestSuite[]>;
	    updateTestSuite(suiteUpdateModel: TestInterfaces.SuiteUpdateModel, project: string, planId: number, suiteId: number): Q.Promise<TestInterfaces.TestSuite>;
	    cloneTestSuite(cloneRequestBody: TestInterfaces.TestSuiteCloneRequest, project: string, sourceSuiteId: number, planId: number): Q.Promise<TestInterfaces.CloneOperationInformation>;
	    getSuitesByTestCaseId(testCaseId: number): Q.Promise<TestInterfaces.TestSuite[]>;
	    createTestSettings(testSettings: TestInterfaces.TestSettings, project: string): Q.Promise<number>;
	    deleteTestSettings(project: string, testSettingsId: number): Q.Promise<void>;
	    getTestSettingsById(project: string, testSettingsId: number): Q.Promise<TestInterfaces.TestSettings>;
	    createTestVariable(testVariable: TestInterfaces.TestVariable, project: string): Q.Promise<TestInterfaces.TestVariable>;
	    deleteTestVariable(project: string, testVariableId: number): Q.Promise<void>;
	    getTestVariable(project: string, testVariableId: number): Q.Promise<TestInterfaces.TestVariable>;
	    getTestVariables(project: string, skip?: number, top?: number): Q.Promise<TestInterfaces.TestVariable[]>;
	    updateTestVariable(testVariable: TestInterfaces.TestVariable, project: string, testVariableId: number): Q.Promise<TestInterfaces.TestVariable>;
	}
	export class TestApi extends basem.ClientApiBase implements ITestApi {
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	     * @param {TestInterfaces.TestAttachmentRequestModel} attachmentRequestModel
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {number} testCaseResultId
	     * @param onResult callback function with the resulting TestInterfaces.TestAttachmentReference
	     */
	    createTestResultAttachment(attachmentRequestModel: TestInterfaces.TestAttachmentRequestModel, project: string, runId: number, testCaseResultId: number, onResult: (err: any, statusCode: number, Attachment: TestInterfaces.TestAttachmentReference) => void): void;
	    /**
	     * Returns a test result attachment
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {number} testCaseResultId
	     * @param {number} attachmentId
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getTestResultAttachmentContent(project: string, runId: number, testCaseResultId: number, attachmentId: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Returns a test result attachment
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {number} testCaseResultId
	     * @param {number} attachmentId
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getTestResultAttachmentZip(project: string, runId: number, testCaseResultId: number, attachmentId: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {TestInterfaces.TestAttachmentRequestModel} attachmentRequestModel
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param onResult callback function with the resulting TestInterfaces.TestAttachmentReference
	     */
	    createTestRunAttachment(attachmentRequestModel: TestInterfaces.TestAttachmentRequestModel, project: string, runId: number, onResult: (err: any, statusCode: number, Attachment: TestInterfaces.TestAttachmentReference) => void): void;
	    /**
	     * Returns a test run attachment
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {number} attachmentId
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getTestRunAttachmentContent(project: string, runId: number, attachmentId: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Returns a test run attachment
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {number} attachmentId
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getTestRunAttachmentZip(project: string, runId: number, attachmentId: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {number} testCaseResultId
	     * @param onResult callback function with the resulting TestInterfaces.WorkItemReference[]
	     */
	    getBugsLinkedToTestResult(project: string, runId: number, testCaseResultId: number, onResult: (err: any, statusCode: number, Bugs: TestInterfaces.WorkItemReference[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param {number} flags
	     * @param onResult callback function with the resulting TestInterfaces.BuildCoverage[]
	     */
	    getBuildCodeCoverage(project: string, buildId: number, flags: number, onResult: (err: any, statusCode: number, CodeCoverage: TestInterfaces.BuildCoverage[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param {number} deltaBuildId
	     * @param onResult callback function with the resulting TestInterfaces.CodeCoverageSummary
	     */
	    getCodeCoverageSummary(project: string, buildId: number, deltaBuildId: number, onResult: (err: any, statusCode: number, CodeCoverage: TestInterfaces.CodeCoverageSummary) => void): void;
	    /**
	     * http://(tfsserver):8080/tfs/DefaultCollection/_apis/test/CodeCoverage?buildId=10 Request: Json of code coverage summary
	     *
	     * @param {TestInterfaces.CodeCoverageData} coverageData
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param onResult callback function
	     */
	    updateCodeCoverageSummary(coverageData: TestInterfaces.CodeCoverageData, project: string, buildId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {number} flags
	     * @param onResult callback function with the resulting TestInterfaces.TestRunCoverage[]
	     */
	    getTestRunCodeCoverage(project: string, runId: number, flags: number, onResult: (err: any, statusCode: number, CodeCoverage: TestInterfaces.TestRunCoverage[]) => void): void;
	    /**
	     * @param {TestInterfaces.TestConfiguration} testConfiguration
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting TestInterfaces.TestConfiguration
	     */
	    createTestConfiguration(testConfiguration: TestInterfaces.TestConfiguration, project: string, onResult: (err: any, statusCode: number, Configuration: TestInterfaces.TestConfiguration) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} testConfigurationId
	     * @param onResult callback function
	     */
	    deleteTestConfiguration(project: string, testConfigurationId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} testConfigurationId
	     * @param onResult callback function with the resulting TestInterfaces.TestConfiguration
	     */
	    getTestConfigurationById(project: string, testConfigurationId: number, onResult: (err: any, statusCode: number, Configuration: TestInterfaces.TestConfiguration) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} skip
	     * @param {number} top
	     * @param {boolean} includeAllProperties
	     * @param onResult callback function with the resulting TestInterfaces.TestConfiguration[]
	     */
	    getTestConfigurations(project: string, skip: number, top: number, includeAllProperties: boolean, onResult: (err: any, statusCode: number, Configurations: TestInterfaces.TestConfiguration[]) => void): void;
	    /**
	     * @param {TestInterfaces.TestConfiguration} testConfiguration
	     * @param {string} project - Project ID or project name
	     * @param {number} testConfigurationId
	     * @param onResult callback function with the resulting TestInterfaces.TestConfiguration
	     */
	    updateTestConfiguration(testConfiguration: TestInterfaces.TestConfiguration, project: string, testConfigurationId: number, onResult: (err: any, statusCode: number, Configuration: TestInterfaces.TestConfiguration) => void): void;
	    /**
	     * @param {TestInterfaces.CustomTestFieldDefinition[]} newFields
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting TestInterfaces.CustomTestFieldDefinition[]
	     */
	    addCustomFields(newFields: TestInterfaces.CustomTestFieldDefinition[], project: string, onResult: (err: any, statusCode: number, ExtensionFields: TestInterfaces.CustomTestFieldDefinition[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {TestInterfaces.CustomTestFieldScope} scopeFilter
	     * @param onResult callback function with the resulting TestInterfaces.CustomTestFieldDefinition[]
	     */
	    queryCustomFields(project: string, scopeFilter: TestInterfaces.CustomTestFieldScope, onResult: (err: any, statusCode: number, ExtensionFields: TestInterfaces.CustomTestFieldDefinition[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param onResult callback function with the resulting TestInterfaces.TestMessageLogDetails[]
	     */
	    getTestRunLogs(project: string, runId: number, onResult: (err: any, statusCode: number, MessageLogs: TestInterfaces.TestMessageLogDetails[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} operationId
	     * @param {boolean} includeDetails
	     * @param onResult callback function with the resulting TestInterfaces.CloneOperationInformation
	     */
	    getPlanCloneInformation(project: string, operationId: number, includeDetails: boolean, onResult: (err: any, statusCode: number, Plan: TestInterfaces.CloneOperationInformation) => void): void;
	    /**
	     * @param {TestInterfaces.PlanUpdateModel} testPlan
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting TestInterfaces.TestPlan
	     */
	    createTestPlan(testPlan: TestInterfaces.PlanUpdateModel, project: string, onResult: (err: any, statusCode: number, Plan: TestInterfaces.TestPlan) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param onResult callback function
	     */
	    deleteTestPlan(project: string, planId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param onResult callback function with the resulting TestInterfaces.TestPlan
	     */
	    getPlanById(project: string, planId: number, onResult: (err: any, statusCode: number, Plan: TestInterfaces.TestPlan) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {string} owner
	     * @param {number} skip
	     * @param {number} top
	     * @param {boolean} includePlanDetails
	     * @param {boolean} filterActivePlans
	     * @param onResult callback function with the resulting TestInterfaces.TestPlan[]
	     */
	    getPlans(project: string, owner: string, skip: number, top: number, includePlanDetails: boolean, filterActivePlans: boolean, onResult: (err: any, statusCode: number, Plans: TestInterfaces.TestPlan[]) => void): void;
	    /**
	     * @param {TestInterfaces.PlanUpdateModel} planUpdateModel
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param onResult callback function with the resulting TestInterfaces.TestPlan
	     */
	    updateTestPlan(planUpdateModel: TestInterfaces.PlanUpdateModel, project: string, planId: number, onResult: (err: any, statusCode: number, Plan: TestInterfaces.TestPlan) => void): void;
	    /**
	     * @param {TestInterfaces.TestPlanCloneRequest} cloneRequestBody
	     * @param {string} project - Project ID or project name
	     * @param {number} sourcePlanId
	     * @param onResult callback function with the resulting TestInterfaces.CloneOperationInformation
	     */
	    cloneTestPlan(cloneRequestBody: TestInterfaces.TestPlanCloneRequest, project: string, sourcePlanId: number, onResult: (err: any, statusCode: number, Plan: TestInterfaces.CloneOperationInformation) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param {number} suiteId
	     * @param {number} pointIds
	     * @param {string} witFields
	     * @param onResult callback function with the resulting TestInterfaces.TestPoint
	     */
	    getPoint(project: string, planId: number, suiteId: number, pointIds: number, witFields: string, onResult: (err: any, statusCode: number, Point: TestInterfaces.TestPoint) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param {number} suiteId
	     * @param {string} witFields
	     * @param {string} configurationId
	     * @param {string} testCaseId
	     * @param {string} testPointIds
	     * @param {boolean} includePointDetails
	     * @param {number} skip
	     * @param {number} top
	     * @param onResult callback function with the resulting TestInterfaces.TestPoint[]
	     */
	    getPoints(project: string, planId: number, suiteId: number, witFields: string, configurationId: string, testCaseId: string, testPointIds: string, includePointDetails: boolean, skip: number, top: number, onResult: (err: any, statusCode: number, Points: TestInterfaces.TestPoint[]) => void): void;
	    /**
	     * @param {TestInterfaces.PointUpdateModel} pointUpdateModel
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param {number} suiteId
	     * @param {string} pointIds
	     * @param onResult callback function with the resulting TestInterfaces.TestPoint[]
	     */
	    updateTestPoints(pointUpdateModel: TestInterfaces.PointUpdateModel, project: string, planId: number, suiteId: number, pointIds: string, onResult: (err: any, statusCode: number, Point: TestInterfaces.TestPoint[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} testRunId
	     * @param {number} testResultId
	     * @param {number} recentDays
	     * @param onResult callback function with the resulting TestInterfaces.WorkItemReference[]
	     */
	    queryTestResultRecentBugs(project: string, testRunId: number, testResultId: number, recentDays: number, onResult: (err: any, statusCode: number, RecentBugs: TestInterfaces.WorkItemReference[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param {string} publishContext
	     * @param {string} groupBy
	     * @param {string} filter
	     * @param onResult callback function with the resulting TestInterfaces.TestResultsDetails
	     */
	    getTestResultDetailsForBuild(project: string, buildId: number, publishContext: string, groupBy: string, filter: string, onResult: (err: any, statusCode: number, ResultDetailsByBuild: TestInterfaces.TestResultsDetails) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseId
	     * @param {number} releaseEnvId
	     * @param {string} publishContext
	     * @param {string} groupBy
	     * @param {string} filter
	     * @param onResult callback function with the resulting TestInterfaces.TestResultsDetails
	     */
	    getTestResultDetailsForRelease(project: string, releaseId: number, releaseEnvId: number, publishContext: string, groupBy: string, filter: string, onResult: (err: any, statusCode: number, ResultDetailsByRelease: TestInterfaces.TestResultsDetails) => void): void;
	    /**
	     * @param {TestInterfaces.ResultRetentionSettings} retentionSettings
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting TestInterfaces.ResultRetentionSettings
	     */
	    createResultRetentionSettings(retentionSettings: TestInterfaces.ResultRetentionSettings, project: string, onResult: (err: any, statusCode: number, ResultRetentionSetting: TestInterfaces.ResultRetentionSettings) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function
	     */
	    deleteResultRetentionSettings(project: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting TestInterfaces.ResultRetentionSettings
	     */
	    getResultRetentionSettings(project: string, onResult: (err: any, statusCode: number, ResultRetentionSetting: TestInterfaces.ResultRetentionSettings) => void): void;
	    /**
	     * @param {TestInterfaces.ResultRetentionSettings} retentionSettings
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting TestInterfaces.ResultRetentionSettings
	     */
	    updateResultRetentionSettings(retentionSettings: TestInterfaces.ResultRetentionSettings, project: string, onResult: (err: any, statusCode: number, ResultRetentionSetting: TestInterfaces.ResultRetentionSettings) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {number} testCaseResultId
	     * @param {number} iterationId
	     * @param {boolean} includeActionResults
	     * @param onResult callback function with the resulting TestInterfaces.TestIterationDetailsModel
	     */
	    getTestIteration(project: string, runId: number, testCaseResultId: number, iterationId: number, includeActionResults: boolean, onResult: (err: any, statusCode: number, Result: TestInterfaces.TestIterationDetailsModel) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {number} testCaseResultId
	     * @param {boolean} includeActionResults
	     * @param onResult callback function with the resulting TestInterfaces.TestIterationDetailsModel[]
	     */
	    getTestIterations(project: string, runId: number, testCaseResultId: number, includeActionResults: boolean, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestIterationDetailsModel[]) => void): void;
	    /**
	     * @param {TestInterfaces.TestResultCreateModel[]} resultCreateModels
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param onResult callback function with the resulting TestInterfaces.TestCaseResult[]
	     */
	    addTestResultsToTestRun(resultCreateModels: TestInterfaces.TestResultCreateModel[], project: string, runId: number, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestCaseResult[]) => void): void;
	    /**
	     * @param {TestInterfaces.TestCaseResultUpdateModel} resultUpdateModel
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {number[]} resultIds
	     * @param onResult callback function with the resulting TestInterfaces.TestCaseResult[]
	     */
	    bulkUpdateTestResults(resultUpdateModel: TestInterfaces.TestCaseResultUpdateModel, project: string, runId: number, resultIds: number[], onResult: (err: any, statusCode: number, Result: TestInterfaces.TestCaseResult[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {number} testCaseResultId
	     * @param {boolean} includeIterationDetails
	     * @param {boolean} includeAssociatedBugs
	     * @param onResult callback function with the resulting TestInterfaces.TestCaseResult
	     */
	    getTestCaseResultById(project: string, runId: number, testCaseResultId: number, includeIterationDetails: boolean, includeAssociatedBugs: boolean, onResult: (err: any, statusCode: number, Result: TestInterfaces.TestCaseResult) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {boolean} includeIterationDetails
	     * @param onResult callback function with the resulting TestInterfaces.TestCaseResult[]
	     */
	    getTestCaseResults(project: string, runId: number, includeIterationDetails: boolean, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestCaseResult[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {number} testCaseResultId
	     * @param {TestInterfaces.ResultDetails} detailsToInclude
	     * @param onResult callback function with the resulting TestInterfaces.TestCaseResult[]
	     */
	    getTestResultById(project: string, runId: number, testCaseResultId: number, detailsToInclude: TestInterfaces.ResultDetails, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestCaseResult[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {TestInterfaces.ResultDetails} detailsToInclude
	     * @param {number} skip
	     * @param {number} top
	     * @param onResult callback function with the resulting TestInterfaces.TestCaseResult[]
	     */
	    getTestResults(project: string, runId: number, detailsToInclude: TestInterfaces.ResultDetails, skip: number, top: number, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestCaseResult[]) => void): void;
	    /**
	     * @param {TestInterfaces.TestCaseResultUpdateModel[]} resultUpdateModels
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param onResult callback function with the resulting TestInterfaces.TestCaseResult[]
	     */
	    updateTestResults(resultUpdateModels: TestInterfaces.TestCaseResultUpdateModel[], project: string, runId: number, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestCaseResult[]) => void): void;
	    /**
	     * @param {TestInterfaces.TestCaseResultIdentifier[]} ids
	     * @param {string} project - Project ID or project name
	     * @param {string[]} fields
	     * @param onResult callback function with the resulting TestInterfaces.TestCaseResult[]
	     */
	    getTestResultsByIds(ids: TestInterfaces.TestCaseResultIdentifier[], project: string, fields: string[], onResult: (err: any, statusCode: number, Results: TestInterfaces.TestCaseResult[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {number} testCaseResultId
	     * @param {number} iterationId
	     * @param {string} actionPath
	     * @param onResult callback function with the resulting TestInterfaces.TestActionResultModel[]
	     */
	    getActionResults(project: string, runId: number, testCaseResultId: number, iterationId: number, actionPath: string, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestActionResultModel[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param {number} testCaseResultId
	     * @param {number} iterationId
	     * @param {string} paramName
	     * @param onResult callback function with the resulting TestInterfaces.TestResultParameterModel[]
	     */
	    getResultParameters(project: string, runId: number, testCaseResultId: number, iterationId: number, paramName: string, onResult: (err: any, statusCode: number, Results: TestInterfaces.TestResultParameterModel[]) => void): void;
	    /**
	     * @param {TestInterfaces.QueryModel} query
	     * @param {string} project - Project ID or project name
	     * @param {boolean} includeResultDetails
	     * @param {boolean} includeIterationDetails
	     * @param {number} skip
	     * @param {number} top
	     * @param onResult callback function with the resulting TestInterfaces.TestCaseResult[]
	     */
	    getTestResultsByQuery(query: TestInterfaces.QueryModel, project: string, includeResultDetails: boolean, includeIterationDetails: boolean, skip: number, top: number, onResult: (err: any, statusCode: number, Result: TestInterfaces.TestCaseResult[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} buildId
	     * @param {string} publishContext
	     * @param {boolean} includeFailureDetails
	     * @param {TestInterfaces.BuildReference} buildToCompare
	     * @param onResult callback function with the resulting TestInterfaces.TestResultSummary
	     */
	    queryTestResultsReportForBuild(project: string, buildId: number, publishContext: string, includeFailureDetails: boolean, buildToCompare: TestInterfaces.BuildReference, onResult: (err: any, statusCode: number, ResultSummaryByBuild: TestInterfaces.TestResultSummary) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseId
	     * @param {number} releaseEnvId
	     * @param {string} publishContext
	     * @param {boolean} includeFailureDetails
	     * @param {TestInterfaces.ReleaseReference} releaseToCompare
	     * @param onResult callback function with the resulting TestInterfaces.TestResultSummary
	     */
	    queryTestResultsReportForRelease(project: string, releaseId: number, releaseEnvId: number, publishContext: string, includeFailureDetails: boolean, releaseToCompare: TestInterfaces.ReleaseReference, onResult: (err: any, statusCode: number, ResultSummaryByRelease: TestInterfaces.TestResultSummary) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} testRunId
	     * @param {number} testResultId
	     * @param {number} historyDays
	     * @param {number} top
	     * @param onResult callback function with the resulting TestInterfaces.TestCaseResult[]
	     */
	    queryTestResultTrendReport(project: string, testRunId: number, testResultId: number, historyDays: number, top: number, onResult: (err: any, statusCode: number, ResultTrend: TestInterfaces.TestCaseResult[]) => void): void;
	    /**
	     * @param {TestInterfaces.TestResultTrendFilter} filter
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting TestInterfaces.AggregatedDataForResultTrend[]
	     */
	    queryResultTrendForBuild(filter: TestInterfaces.TestResultTrendFilter, project: string, onResult: (err: any, statusCode: number, ResultTrendByBuild: TestInterfaces.AggregatedDataForResultTrend[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param onResult callback function with the resulting TestInterfaces.TestRunStatistic
	     */
	    getTestRunStatistics(project: string, runId: number, onResult: (err: any, statusCode: number, Run: TestInterfaces.TestRunStatistic) => void): void;
	    /**
	     * @param {TestInterfaces.QueryModel} query
	     * @param {string} project - Project ID or project name
	     * @param {boolean} includeRunDetails
	     * @param {number} skip
	     * @param {number} top
	     * @param onResult callback function with the resulting TestInterfaces.TestRun[]
	     */
	    getTestRunsByQuery(query: TestInterfaces.QueryModel, project: string, includeRunDetails: boolean, skip: number, top: number, onResult: (err: any, statusCode: number, Run: TestInterfaces.TestRun[]) => void): void;
	    /**
	     * @param {TestInterfaces.RunCreateModel} testRun
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting TestInterfaces.TestRun
	     */
	    createTestRun(testRun: TestInterfaces.RunCreateModel, project: string, onResult: (err: any, statusCode: number, Run: TestInterfaces.TestRun) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param onResult callback function
	     */
	    deleteTestRun(project: string, runId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param onResult callback function with the resulting TestInterfaces.TestRun
	     */
	    getTestRunById(project: string, runId: number, onResult: (err: any, statusCode: number, Run: TestInterfaces.TestRun) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {string} buildUri
	     * @param {string} owner
	     * @param {string} tmiRunId
	     * @param {number} planId
	     * @param {boolean} includeRunDetails
	     * @param {boolean} automated
	     * @param {number} skip
	     * @param {number} top
	     * @param onResult callback function with the resulting TestInterfaces.TestRun[]
	     */
	    getTestRuns(project: string, buildUri: string, owner: string, tmiRunId: string, planId: number, includeRunDetails: boolean, automated: boolean, skip: number, top: number, onResult: (err: any, statusCode: number, Runs: TestInterfaces.TestRun[]) => void): void;
	    /**
	     * @param {TestInterfaces.RunUpdateModel} runUpdateModel
	     * @param {string} project - Project ID or project name
	     * @param {number} runId
	     * @param onResult callback function with the resulting TestInterfaces.TestRun
	     */
	    updateTestRun(runUpdateModel: TestInterfaces.RunUpdateModel, project: string, runId: number, onResult: (err: any, statusCode: number, Run: TestInterfaces.TestRun) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} operationId
	     * @param {boolean} includeDetails
	     * @param onResult callback function with the resulting TestInterfaces.CloneOperationInformation
	     */
	    getSuiteCloneInformation(project: string, operationId: number, includeDetails: boolean, onResult: (err: any, statusCode: number, Suite: TestInterfaces.CloneOperationInformation) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param {number} suiteId
	     * @param {string} testCaseIds
	     * @param onResult callback function with the resulting TestInterfaces.SuiteTestCase[]
	     */
	    addTestCasesToSuite(project: string, planId: number, suiteId: number, testCaseIds: string, onResult: (err: any, statusCode: number, Suites: TestInterfaces.SuiteTestCase[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param {number} suiteId
	     * @param {number} testCaseIds
	     * @param onResult callback function with the resulting TestInterfaces.SuiteTestCase
	     */
	    getTestCaseById(project: string, planId: number, suiteId: number, testCaseIds: number, onResult: (err: any, statusCode: number, Suite: TestInterfaces.SuiteTestCase) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param {number} suiteId
	     * @param onResult callback function with the resulting TestInterfaces.SuiteTestCase[]
	     */
	    getTestCases(project: string, planId: number, suiteId: number, onResult: (err: any, statusCode: number, Suites: TestInterfaces.SuiteTestCase[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param {number} suiteId
	     * @param {string} testCaseIds
	     * @param onResult callback function
	     */
	    removeTestCasesFromSuiteUrl(project: string, planId: number, suiteId: number, testCaseIds: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {TestInterfaces.SuiteCreateModel} testSuite
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param {number} suiteId
	     * @param onResult callback function with the resulting TestInterfaces.TestSuite[]
	     */
	    createTestSuite(testSuite: TestInterfaces.SuiteCreateModel, project: string, planId: number, suiteId: number, onResult: (err: any, statusCode: number, Suite: TestInterfaces.TestSuite[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param {number} suiteId
	     * @param onResult callback function
	     */
	    deleteTestSuite(project: string, planId: number, suiteId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param {number} suiteId
	     * @param {boolean} includeChildSuites
	     * @param onResult callback function with the resulting TestInterfaces.TestSuite
	     */
	    getTestSuiteById(project: string, planId: number, suiteId: number, includeChildSuites: boolean, onResult: (err: any, statusCode: number, Suite: TestInterfaces.TestSuite) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param {boolean} includeSuites
	     * @param {number} skip
	     * @param {number} top
	     * @param {boolean} asTreeView
	     * @param onResult callback function with the resulting TestInterfaces.TestSuite[]
	     */
	    getTestSuitesForPlan(project: string, planId: number, includeSuites: boolean, skip: number, top: number, asTreeView: boolean, onResult: (err: any, statusCode: number, Suites: TestInterfaces.TestSuite[]) => void): void;
	    /**
	     * @param {TestInterfaces.SuiteUpdateModel} suiteUpdateModel
	     * @param {string} project - Project ID or project name
	     * @param {number} planId
	     * @param {number} suiteId
	     * @param onResult callback function with the resulting TestInterfaces.TestSuite
	     */
	    updateTestSuite(suiteUpdateModel: TestInterfaces.SuiteUpdateModel, project: string, planId: number, suiteId: number, onResult: (err: any, statusCode: number, Suite: TestInterfaces.TestSuite) => void): void;
	    /**
	     * @param {TestInterfaces.TestSuiteCloneRequest} cloneRequestBody
	     * @param {string} project - Project ID or project name
	     * @param {number} sourceSuiteId
	     * @param {number} planId
	     * @param onResult callback function with the resulting TestInterfaces.CloneOperationInformation
	     */
	    cloneTestSuite(cloneRequestBody: TestInterfaces.TestSuiteCloneRequest, project: string, sourceSuiteId: number, planId: number, onResult: (err: any, statusCode: number, Suite: TestInterfaces.CloneOperationInformation) => void): void;
	    /**
	     * @param {number} testCaseId
	     * @param onResult callback function with the resulting TestInterfaces.TestSuite[]
	     */
	    getSuitesByTestCaseId(testCaseId: number, onResult: (err: any, statusCode: number, Suites: TestInterfaces.TestSuite[]) => void): void;
	    /**
	     * @param {TestInterfaces.TestSettings} testSettings
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting number
	     */
	    createTestSettings(testSettings: TestInterfaces.TestSettings, project: string, onResult: (err: any, statusCode: number, TestSetting: number) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} testSettingsId
	     * @param onResult callback function
	     */
	    deleteTestSettings(project: string, testSettingsId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} testSettingsId
	     * @param onResult callback function with the resulting TestInterfaces.TestSettings
	     */
	    getTestSettingsById(project: string, testSettingsId: number, onResult: (err: any, statusCode: number, TestSetting: TestInterfaces.TestSettings) => void): void;
	    /**
	     * @param {TestInterfaces.TestVariable} testVariable
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting TestInterfaces.TestVariable
	     */
	    createTestVariable(testVariable: TestInterfaces.TestVariable, project: string, onResult: (err: any, statusCode: number, Variable: TestInterfaces.TestVariable) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} testVariableId
	     * @param onResult callback function
	     */
	    deleteTestVariable(project: string, testVariableId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} testVariableId
	     * @param onResult callback function with the resulting TestInterfaces.TestVariable
	     */
	    getTestVariable(project: string, testVariableId: number, onResult: (err: any, statusCode: number, Variable: TestInterfaces.TestVariable) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} skip
	     * @param {number} top
	     * @param onResult callback function with the resulting TestInterfaces.TestVariable[]
	     */
	    getTestVariables(project: string, skip: number, top: number, onResult: (err: any, statusCode: number, Variables: TestInterfaces.TestVariable[]) => void): void;
	    /**
	     * @param {TestInterfaces.TestVariable} testVariable
	     * @param {string} project - Project ID or project name
	     * @param {number} testVariableId
	     * @param onResult callback function with the resulting TestInterfaces.TestVariable
	     */
	    updateTestVariable(testVariable: TestInterfaces.TestVariable, project: string, testVariableId: number, onResult: (err: any, statusCode: number, Variable: TestInterfaces.TestVariable) => void): void;
	}
	export class QTestApi extends basem.QClientApiBase implements IQTestApi {
	    api: TestApi;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	    * @param {TestInterfaces.TestAttachmentRequestModel} attachmentRequestModel
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {number} testCaseResultId
	    */
	    createTestResultAttachment(attachmentRequestModel: TestInterfaces.TestAttachmentRequestModel, project: string, runId: number, testCaseResultId: number): Q.Promise<TestInterfaces.TestAttachmentReference>;
	    /**
	    * Returns a test result attachment
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {number} testCaseResultId
	    * @param {number} attachmentId
	    */
	    getTestResultAttachmentContent(project: string, runId: number, testCaseResultId: number, attachmentId: number): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Returns a test result attachment
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {number} testCaseResultId
	    * @param {number} attachmentId
	    */
	    getTestResultAttachmentZip(project: string, runId: number, testCaseResultId: number, attachmentId: number): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {TestInterfaces.TestAttachmentRequestModel} attachmentRequestModel
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    */
	    createTestRunAttachment(attachmentRequestModel: TestInterfaces.TestAttachmentRequestModel, project: string, runId: number): Q.Promise<TestInterfaces.TestAttachmentReference>;
	    /**
	    * Returns a test run attachment
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {number} attachmentId
	    */
	    getTestRunAttachmentContent(project: string, runId: number, attachmentId: number): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Returns a test run attachment
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {number} attachmentId
	    */
	    getTestRunAttachmentZip(project: string, runId: number, attachmentId: number): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {number} testCaseResultId
	    */
	    getBugsLinkedToTestResult(project: string, runId: number, testCaseResultId: number): Q.Promise<TestInterfaces.WorkItemReference[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    * @param {number} flags
	    */
	    getBuildCodeCoverage(project: string, buildId: number, flags: number): Q.Promise<TestInterfaces.BuildCoverage[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    * @param {number} deltaBuildId
	    */
	    getCodeCoverageSummary(project: string, buildId: number, deltaBuildId?: number): Q.Promise<TestInterfaces.CodeCoverageSummary>;
	    /**
	    * http://(tfsserver):8080/tfs/DefaultCollection/_apis/test/CodeCoverage?buildId=10 Request: Json of code coverage summary
	    *
	    * @param {TestInterfaces.CodeCoverageData} coverageData
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    */
	    updateCodeCoverageSummary(coverageData: TestInterfaces.CodeCoverageData, project: string, buildId: number): Q.Promise<void>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {number} flags
	    */
	    getTestRunCodeCoverage(project: string, runId: number, flags: number): Q.Promise<TestInterfaces.TestRunCoverage[]>;
	    /**
	    * @param {TestInterfaces.TestConfiguration} testConfiguration
	    * @param {string} project - Project ID or project name
	    */
	    createTestConfiguration(testConfiguration: TestInterfaces.TestConfiguration, project: string): Q.Promise<TestInterfaces.TestConfiguration>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} testConfigurationId
	    */
	    deleteTestConfiguration(project: string, testConfigurationId: number): Q.Promise<void>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} testConfigurationId
	    */
	    getTestConfigurationById(project: string, testConfigurationId: number): Q.Promise<TestInterfaces.TestConfiguration>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} skip
	    * @param {number} top
	    * @param {boolean} includeAllProperties
	    */
	    getTestConfigurations(project: string, skip?: number, top?: number, includeAllProperties?: boolean): Q.Promise<TestInterfaces.TestConfiguration[]>;
	    /**
	    * @param {TestInterfaces.TestConfiguration} testConfiguration
	    * @param {string} project - Project ID or project name
	    * @param {number} testConfigurationId
	    */
	    updateTestConfiguration(testConfiguration: TestInterfaces.TestConfiguration, project: string, testConfigurationId: number): Q.Promise<TestInterfaces.TestConfiguration>;
	    /**
	    * @param {TestInterfaces.CustomTestFieldDefinition[]} newFields
	    * @param {string} project - Project ID or project name
	    */
	    addCustomFields(newFields: TestInterfaces.CustomTestFieldDefinition[], project: string): Q.Promise<TestInterfaces.CustomTestFieldDefinition[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {TestInterfaces.CustomTestFieldScope} scopeFilter
	    */
	    queryCustomFields(project: string, scopeFilter: TestInterfaces.CustomTestFieldScope): Q.Promise<TestInterfaces.CustomTestFieldDefinition[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    */
	    getTestRunLogs(project: string, runId: number): Q.Promise<TestInterfaces.TestMessageLogDetails[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} operationId
	    * @param {boolean} includeDetails
	    */
	    getPlanCloneInformation(project: string, operationId: number, includeDetails?: boolean): Q.Promise<TestInterfaces.CloneOperationInformation>;
	    /**
	    * @param {TestInterfaces.PlanUpdateModel} testPlan
	    * @param {string} project - Project ID or project name
	    */
	    createTestPlan(testPlan: TestInterfaces.PlanUpdateModel, project: string): Q.Promise<TestInterfaces.TestPlan>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    */
	    deleteTestPlan(project: string, planId: number): Q.Promise<void>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    */
	    getPlanById(project: string, planId: number): Q.Promise<TestInterfaces.TestPlan>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {string} owner
	    * @param {number} skip
	    * @param {number} top
	    * @param {boolean} includePlanDetails
	    * @param {boolean} filterActivePlans
	    */
	    getPlans(project: string, owner?: string, skip?: number, top?: number, includePlanDetails?: boolean, filterActivePlans?: boolean): Q.Promise<TestInterfaces.TestPlan[]>;
	    /**
	    * @param {TestInterfaces.PlanUpdateModel} planUpdateModel
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    */
	    updateTestPlan(planUpdateModel: TestInterfaces.PlanUpdateModel, project: string, planId: number): Q.Promise<TestInterfaces.TestPlan>;
	    /**
	    * @param {TestInterfaces.TestPlanCloneRequest} cloneRequestBody
	    * @param {string} project - Project ID or project name
	    * @param {number} sourcePlanId
	    */
	    cloneTestPlan(cloneRequestBody: TestInterfaces.TestPlanCloneRequest, project: string, sourcePlanId: number): Q.Promise<TestInterfaces.CloneOperationInformation>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    * @param {number} suiteId
	    * @param {number} pointIds
	    * @param {string} witFields
	    */
	    getPoint(project: string, planId: number, suiteId: number, pointIds: number, witFields?: string): Q.Promise<TestInterfaces.TestPoint>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    * @param {number} suiteId
	    * @param {string} witFields
	    * @param {string} configurationId
	    * @param {string} testCaseId
	    * @param {string} testPointIds
	    * @param {boolean} includePointDetails
	    * @param {number} skip
	    * @param {number} top
	    */
	    getPoints(project: string, planId: number, suiteId: number, witFields?: string, configurationId?: string, testCaseId?: string, testPointIds?: string, includePointDetails?: boolean, skip?: number, top?: number): Q.Promise<TestInterfaces.TestPoint[]>;
	    /**
	    * @param {TestInterfaces.PointUpdateModel} pointUpdateModel
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    * @param {number} suiteId
	    * @param {string} pointIds
	    */
	    updateTestPoints(pointUpdateModel: TestInterfaces.PointUpdateModel, project: string, planId: number, suiteId: number, pointIds: string): Q.Promise<TestInterfaces.TestPoint[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} testRunId
	    * @param {number} testResultId
	    * @param {number} recentDays
	    */
	    queryTestResultRecentBugs(project: string, testRunId: number, testResultId: number, recentDays?: number): Q.Promise<TestInterfaces.WorkItemReference[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    * @param {string} publishContext
	    * @param {string} groupBy
	    * @param {string} filter
	    */
	    getTestResultDetailsForBuild(project: string, buildId: number, publishContext?: string, groupBy?: string, filter?: string): Q.Promise<TestInterfaces.TestResultsDetails>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseId
	    * @param {number} releaseEnvId
	    * @param {string} publishContext
	    * @param {string} groupBy
	    * @param {string} filter
	    */
	    getTestResultDetailsForRelease(project: string, releaseId: number, releaseEnvId: number, publishContext?: string, groupBy?: string, filter?: string): Q.Promise<TestInterfaces.TestResultsDetails>;
	    /**
	    * @param {TestInterfaces.ResultRetentionSettings} retentionSettings
	    * @param {string} project - Project ID or project name
	    */
	    createResultRetentionSettings(retentionSettings: TestInterfaces.ResultRetentionSettings, project: string): Q.Promise<TestInterfaces.ResultRetentionSettings>;
	    /**
	    * @param {string} project - Project ID or project name
	    */
	    deleteResultRetentionSettings(project: string): Q.Promise<void>;
	    /**
	    * @param {string} project - Project ID or project name
	    */
	    getResultRetentionSettings(project: string): Q.Promise<TestInterfaces.ResultRetentionSettings>;
	    /**
	    * @param {TestInterfaces.ResultRetentionSettings} retentionSettings
	    * @param {string} project - Project ID or project name
	    */
	    updateResultRetentionSettings(retentionSettings: TestInterfaces.ResultRetentionSettings, project: string): Q.Promise<TestInterfaces.ResultRetentionSettings>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {number} testCaseResultId
	    * @param {number} iterationId
	    * @param {boolean} includeActionResults
	    */
	    getTestIteration(project: string, runId: number, testCaseResultId: number, iterationId: number, includeActionResults?: boolean): Q.Promise<TestInterfaces.TestIterationDetailsModel>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {number} testCaseResultId
	    * @param {boolean} includeActionResults
	    */
	    getTestIterations(project: string, runId: number, testCaseResultId: number, includeActionResults?: boolean): Q.Promise<TestInterfaces.TestIterationDetailsModel[]>;
	    /**
	    * @param {TestInterfaces.TestResultCreateModel[]} resultCreateModels
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    */
	    addTestResultsToTestRun(resultCreateModels: TestInterfaces.TestResultCreateModel[], project: string, runId: number): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    /**
	    * @param {TestInterfaces.TestCaseResultUpdateModel} resultUpdateModel
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {number[]} resultIds
	    */
	    bulkUpdateTestResults(resultUpdateModel: TestInterfaces.TestCaseResultUpdateModel, project: string, runId: number, resultIds: number[]): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {number} testCaseResultId
	    * @param {boolean} includeIterationDetails
	    * @param {boolean} includeAssociatedBugs
	    */
	    getTestCaseResultById(project: string, runId: number, testCaseResultId: number, includeIterationDetails: boolean, includeAssociatedBugs?: boolean): Q.Promise<TestInterfaces.TestCaseResult>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {boolean} includeIterationDetails
	    */
	    getTestCaseResults(project: string, runId: number, includeIterationDetails: boolean): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {number} testCaseResultId
	    * @param {TestInterfaces.ResultDetails} detailsToInclude
	    */
	    getTestResultById(project: string, runId: number, testCaseResultId: number, detailsToInclude?: TestInterfaces.ResultDetails): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {TestInterfaces.ResultDetails} detailsToInclude
	    * @param {number} skip
	    * @param {number} top
	    */
	    getTestResults(project: string, runId: number, detailsToInclude?: TestInterfaces.ResultDetails, skip?: number, top?: number): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    /**
	    * @param {TestInterfaces.TestCaseResultUpdateModel[]} resultUpdateModels
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    */
	    updateTestResults(resultUpdateModels: TestInterfaces.TestCaseResultUpdateModel[], project: string, runId: number): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    /**
	    * @param {TestInterfaces.TestCaseResultIdentifier[]} ids
	    * @param {string} project - Project ID or project name
	    * @param {string[]} fields
	    */
	    getTestResultsByIds(ids: TestInterfaces.TestCaseResultIdentifier[], project: string, fields: string[]): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {number} testCaseResultId
	    * @param {number} iterationId
	    * @param {string} actionPath
	    */
	    getActionResults(project: string, runId: number, testCaseResultId: number, iterationId: number, actionPath?: string): Q.Promise<TestInterfaces.TestActionResultModel[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    * @param {number} testCaseResultId
	    * @param {number} iterationId
	    * @param {string} paramName
	    */
	    getResultParameters(project: string, runId: number, testCaseResultId: number, iterationId: number, paramName?: string): Q.Promise<TestInterfaces.TestResultParameterModel[]>;
	    /**
	    * @param {TestInterfaces.QueryModel} query
	    * @param {string} project - Project ID or project name
	    * @param {boolean} includeResultDetails
	    * @param {boolean} includeIterationDetails
	    * @param {number} skip
	    * @param {number} top
	    */
	    getTestResultsByQuery(query: TestInterfaces.QueryModel, project: string, includeResultDetails?: boolean, includeIterationDetails?: boolean, skip?: number, top?: number): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} buildId
	    * @param {string} publishContext
	    * @param {boolean} includeFailureDetails
	    * @param {TestInterfaces.BuildReference} buildToCompare
	    */
	    queryTestResultsReportForBuild(project: string, buildId: number, publishContext?: string, includeFailureDetails?: boolean, buildToCompare?: TestInterfaces.BuildReference): Q.Promise<TestInterfaces.TestResultSummary>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseId
	    * @param {number} releaseEnvId
	    * @param {string} publishContext
	    * @param {boolean} includeFailureDetails
	    * @param {TestInterfaces.ReleaseReference} releaseToCompare
	    */
	    queryTestResultsReportForRelease(project: string, releaseId: number, releaseEnvId: number, publishContext?: string, includeFailureDetails?: boolean, releaseToCompare?: TestInterfaces.ReleaseReference): Q.Promise<TestInterfaces.TestResultSummary>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} testRunId
	    * @param {number} testResultId
	    * @param {number} historyDays
	    * @param {number} top
	    */
	    queryTestResultTrendReport(project: string, testRunId: number, testResultId: number, historyDays?: number, top?: number): Q.Promise<TestInterfaces.TestCaseResult[]>;
	    /**
	    * @param {TestInterfaces.TestResultTrendFilter} filter
	    * @param {string} project - Project ID or project name
	    */
	    queryResultTrendForBuild(filter: TestInterfaces.TestResultTrendFilter, project: string): Q.Promise<TestInterfaces.AggregatedDataForResultTrend[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    */
	    getTestRunStatistics(project: string, runId: number): Q.Promise<TestInterfaces.TestRunStatistic>;
	    /**
	    * @param {TestInterfaces.QueryModel} query
	    * @param {string} project - Project ID or project name
	    * @param {boolean} includeRunDetails
	    * @param {number} skip
	    * @param {number} top
	    */
	    getTestRunsByQuery(query: TestInterfaces.QueryModel, project: string, includeRunDetails?: boolean, skip?: number, top?: number): Q.Promise<TestInterfaces.TestRun[]>;
	    /**
	    * @param {TestInterfaces.RunCreateModel} testRun
	    * @param {string} project - Project ID or project name
	    */
	    createTestRun(testRun: TestInterfaces.RunCreateModel, project: string): Q.Promise<TestInterfaces.TestRun>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    */
	    deleteTestRun(project: string, runId: number): Q.Promise<void>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    */
	    getTestRunById(project: string, runId: number): Q.Promise<TestInterfaces.TestRun>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {string} buildUri
	    * @param {string} owner
	    * @param {string} tmiRunId
	    * @param {number} planId
	    * @param {boolean} includeRunDetails
	    * @param {boolean} automated
	    * @param {number} skip
	    * @param {number} top
	    */
	    getTestRuns(project: string, buildUri?: string, owner?: string, tmiRunId?: string, planId?: number, includeRunDetails?: boolean, automated?: boolean, skip?: number, top?: number): Q.Promise<TestInterfaces.TestRun[]>;
	    /**
	    * @param {TestInterfaces.RunUpdateModel} runUpdateModel
	    * @param {string} project - Project ID or project name
	    * @param {number} runId
	    */
	    updateTestRun(runUpdateModel: TestInterfaces.RunUpdateModel, project: string, runId: number): Q.Promise<TestInterfaces.TestRun>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} operationId
	    * @param {boolean} includeDetails
	    */
	    getSuiteCloneInformation(project: string, operationId: number, includeDetails?: boolean): Q.Promise<TestInterfaces.CloneOperationInformation>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    * @param {number} suiteId
	    * @param {string} testCaseIds
	    */
	    addTestCasesToSuite(project: string, planId: number, suiteId: number, testCaseIds: string): Q.Promise<TestInterfaces.SuiteTestCase[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    * @param {number} suiteId
	    * @param {number} testCaseIds
	    */
	    getTestCaseById(project: string, planId: number, suiteId: number, testCaseIds: number): Q.Promise<TestInterfaces.SuiteTestCase>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    * @param {number} suiteId
	    */
	    getTestCases(project: string, planId: number, suiteId: number): Q.Promise<TestInterfaces.SuiteTestCase[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    * @param {number} suiteId
	    * @param {string} testCaseIds
	    */
	    removeTestCasesFromSuiteUrl(project: string, planId: number, suiteId: number, testCaseIds: string): Q.Promise<void>;
	    /**
	    * @param {TestInterfaces.SuiteCreateModel} testSuite
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    * @param {number} suiteId
	    */
	    createTestSuite(testSuite: TestInterfaces.SuiteCreateModel, project: string, planId: number, suiteId: number): Q.Promise<TestInterfaces.TestSuite[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    * @param {number} suiteId
	    */
	    deleteTestSuite(project: string, planId: number, suiteId: number): Q.Promise<void>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    * @param {number} suiteId
	    * @param {boolean} includeChildSuites
	    */
	    getTestSuiteById(project: string, planId: number, suiteId: number, includeChildSuites?: boolean): Q.Promise<TestInterfaces.TestSuite>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    * @param {boolean} includeSuites
	    * @param {number} skip
	    * @param {number} top
	    * @param {boolean} asTreeView
	    */
	    getTestSuitesForPlan(project: string, planId: number, includeSuites?: boolean, skip?: number, top?: number, asTreeView?: boolean): Q.Promise<TestInterfaces.TestSuite[]>;
	    /**
	    * @param {TestInterfaces.SuiteUpdateModel} suiteUpdateModel
	    * @param {string} project - Project ID or project name
	    * @param {number} planId
	    * @param {number} suiteId
	    */
	    updateTestSuite(suiteUpdateModel: TestInterfaces.SuiteUpdateModel, project: string, planId: number, suiteId: number): Q.Promise<TestInterfaces.TestSuite>;
	    /**
	    * @param {TestInterfaces.TestSuiteCloneRequest} cloneRequestBody
	    * @param {string} project - Project ID or project name
	    * @param {number} sourceSuiteId
	    * @param {number} planId
	    */
	    cloneTestSuite(cloneRequestBody: TestInterfaces.TestSuiteCloneRequest, project: string, sourceSuiteId: number, planId: number): Q.Promise<TestInterfaces.CloneOperationInformation>;
	    /**
	    * @param {number} testCaseId
	    */
	    getSuitesByTestCaseId(testCaseId: number): Q.Promise<TestInterfaces.TestSuite[]>;
	    /**
	    * @param {TestInterfaces.TestSettings} testSettings
	    * @param {string} project - Project ID or project name
	    */
	    createTestSettings(testSettings: TestInterfaces.TestSettings, project: string): Q.Promise<number>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} testSettingsId
	    */
	    deleteTestSettings(project: string, testSettingsId: number): Q.Promise<void>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} testSettingsId
	    */
	    getTestSettingsById(project: string, testSettingsId: number): Q.Promise<TestInterfaces.TestSettings>;
	    /**
	    * @param {TestInterfaces.TestVariable} testVariable
	    * @param {string} project - Project ID or project name
	    */
	    createTestVariable(testVariable: TestInterfaces.TestVariable, project: string): Q.Promise<TestInterfaces.TestVariable>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} testVariableId
	    */
	    deleteTestVariable(project: string, testVariableId: number): Q.Promise<void>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} testVariableId
	    */
	    getTestVariable(project: string, testVariableId: number): Q.Promise<TestInterfaces.TestVariable>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} skip
	    * @param {number} top
	    */
	    getTestVariables(project: string, skip?: number, top?: number): Q.Promise<TestInterfaces.TestVariable[]>;
	    /**
	    * @param {TestInterfaces.TestVariable} testVariable
	    * @param {string} project - Project ID or project name
	    * @param {number} testVariableId
	    */
	    updateTestVariable(testVariable: TestInterfaces.TestVariable, project: string, testVariableId: number): Q.Promise<TestInterfaces.TestVariable>;
	}

}
declare module 'vso-node-api/interfaces/TfvcInterfaces' {
	import TfsCoreInterfaces = require('vso-node-api/interfaces/CoreInterfaces');
	import VSSInterfaces = require('vso-node-api/interfaces/common/VSSInterfaces');
	export interface AssociatedWorkItem {
	    assignedTo: string;
	    id: number;
	    state: string;
	    title: string;
	    /**
	     * REST url
	     */
	    url: string;
	    webUrl: string;
	    workItemType: string;
	}
	export interface Change<T> {
	    changeType: VersionControlChangeType;
	    item: T;
	    newContent: ItemContent;
	    sourceServerItem: string;
	    url: string;
	}
	export interface ChangeCountDictionary {
	}
	export interface ChangeList<T> {
	    allChangesIncluded: boolean;
	    changeCounts: {
	        [key: number]: number;
	    };
	    changes: Change<T>[];
	    comment: string;
	    commentTruncated: boolean;
	    creationDate: Date;
	    notes: CheckinNote[];
	    owner: string;
	    ownerDisplayName: string;
	    ownerId: string;
	    sortDate: Date;
	    version: string;
	}
	/**
	 * Criteria used in a search for change lists
	 */
	export interface ChangeListSearchCriteria {
	    /**
	     * If provided, a version descriptor to compare against base
	     */
	    compareVersion: string;
	    /**
	     * If true, don't include delete history entries
	     */
	    excludeDeletes: boolean;
	    /**
	     * Whether or not to follow renames for the given item being queried
	     */
	    followRenames: boolean;
	    /**
	     * If provided, only include history entries created after this date (string)
	     */
	    fromDate: string;
	    /**
	     * If provided, a version descriptor for the earliest change list to include
	     */
	    fromVersion: string;
	    /**
	     * Path of item to search under
	     */
	    itemPath: string;
	    /**
	     * Version of the items to search
	     */
	    itemVersion: string;
	    /**
	     * Number of results to skip (used when clicking more...)
	     */
	    skip: number;
	    /**
	     * If provided, only include history entries created before this date (string)
	     */
	    toDate: string;
	    /**
	     * If provided, the maximum number of history entries to return
	     */
	    top: number;
	    /**
	     * If provided, a version descriptor for the latest change list to include
	     */
	    toVersion: string;
	    /**
	     * Alias or display name of user who made the changes
	     */
	    user: string;
	}
	export interface CheckinNote {
	    name: string;
	    value: string;
	}
	export interface FileContentMetadata {
	    contentType: string;
	    encoding: number;
	    extension: string;
	    fileName: string;
	    isBinary: boolean;
	    isImage: boolean;
	    vsLink: string;
	}
	export interface GitBaseVersionDescriptor extends GitVersionDescriptor {
	    /**
	     * Version string identifier (name of tag/branch, SHA1 of commit)
	     */
	    baseVersion: string;
	    /**
	     * Version options - Specify additional modifiers to version (e.g Previous)
	     */
	    baseVersionOptions: GitVersionOptions;
	    /**
	     * Version type (branch, tag, or commit). Determines how Id is interpreted
	     */
	    baseVersionType: GitVersionType;
	}
	export interface GitBlobRef {
	    _links: any;
	    /**
	     * SHA1 hash of git object
	     */
	    objectId: string;
	    /**
	     * Size of blob content (in bytes)
	     */
	    size: number;
	    url: string;
	}
	export interface GitBranchStats {
	    aheadCount: number;
	    behindCount: number;
	    commit: GitCommitRef;
	    isBaseVersion: boolean;
	    name: string;
	}
	export interface GitChange extends Change<GitItem> {
	}
	export interface GitCommit extends GitCommitRef {
	    push: GitPushRef;
	    treeId: string;
	}
	export interface GitCommitChanges {
	    changeCounts: ChangeCountDictionary;
	    changes: GitChange[];
	}
	export interface GitCommitDiffs {
	    aheadCount: number;
	    allChangesIncluded: boolean;
	    baseCommit: string;
	    behindCount: number;
	    changeCounts: {
	        [key: number]: number;
	    };
	    changes: GitChange[];
	    commonCommit: string;
	    targetCommit: string;
	}
	export interface GitCommitRef {
	    _links: any;
	    author: GitUserDate;
	    changeCounts: ChangeCountDictionary;
	    changes: GitChange[];
	    comment: string;
	    commentTruncated: boolean;
	    commitId: string;
	    committer: GitUserDate;
	    parents: string[];
	    remoteUrl: string;
	    url: string;
	}
	export interface GitCommitToCreate {
	    baseRef: GitRef;
	    comment: string;
	    pathActions: GitPathAction[];
	}
	export interface GitDeletedRepository {
	    createdDate: Date;
	    deletedBy: VSSInterfaces.IdentityRef;
	    deletedDate: Date;
	    id: string;
	    name: string;
	    project: TfsCoreInterfaces.TeamProjectReference;
	}
	export interface GitHistoryQueryResults extends HistoryQueryResults<GitItem> {
	    /**
	     * Seed commit used for querying history.  Used for skip feature.
	     */
	    startingCommitId: string;
	    unpopulatedCount: number;
	    unprocessedCount: number;
	}
	export interface GitItem extends ItemModel {
	    /**
	     * SHA1 of commit item was fetched at
	     */
	    commitId: string;
	    /**
	     * Type of object (Commit, Tree, Blob, Tag, ...)
	     */
	    gitObjectType: GitObjectType;
	    /**
	     * Shallow ref to commit that last changed this item Only populated if latestProcessedChange is requested May not be accurate if latest change is not yet cached
	     */
	    latestProcessedChange: GitCommitRef;
	    /**
	     * Git object id
	     */
	    objectId: string;
	    /**
	     * Git object id
	     */
	    originalObjectId: string;
	}
	export interface GitItemDescriptor {
	    /**
	     * Path to item
	     */
	    path: string;
	    /**
	     * Specifies whether to include children (OneLevel), all descendants (Full), or None
	     */
	    recursionLevel: VersionControlRecursionType;
	    /**
	     * Version string (interpretation based on VersionType defined in subclass
	     */
	    version: string;
	    /**
	     * Version modifiers (e.g. previous)
	     */
	    versionOptions: GitVersionOptions;
	    /**
	     * How to interpret version (branch,tag,commit)
	     */
	    versionType: GitVersionType;
	}
	export interface GitItemRequestData {
	    /**
	     * Whether to include metadata for all items
	     */
	    includeContentMetadata: boolean;
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    /**
	     * Collection of items to fetch, including path, version, and recursion level
	     */
	    itemDescriptors: GitItemDescriptor[];
	    /**
	     * Whether to include shallow ref to commit that last changed each item
	     */
	    latestProcessedChange: boolean;
	}
	export interface GitLimitedRefCriteria {
	    _links: any;
	    refExactMatches: string[];
	    refNamespaces: string[];
	    url: string;
	}
	export enum GitObjectType {
	    Bad = 0,
	    Commit = 1,
	    Tree = 2,
	    Blob = 3,
	    Tag = 4,
	    Ext2 = 5,
	    OfsDelta = 6,
	    RefDelta = 7,
	}
	export interface GitPathAction {
	    action: GitPathActions;
	    base64Content: string;
	    path: string;
	    rawTextContent: string;
	    targetPath: string;
	}
	export enum GitPathActions {
	    None = 0,
	    Edit = 1,
	    Delete = 2,
	    Add = 3,
	    Rename = 4,
	}
	export enum GitPermissionScope {
	    Project = 0,
	    Repository = 1,
	    Branch = 2,
	}
	export interface GitPullRequest {
	    _links: any;
	    closedDate: Date;
	    codeReviewId: number;
	    commits: GitCommitRef[];
	    completionOptions: GitPullRequestCompletionOptions;
	    completionQueueTime: Date;
	    createdBy: VSSInterfaces.IdentityRef;
	    creationDate: Date;
	    description: string;
	    lastMergeCommit: GitCommitRef;
	    lastMergeSourceCommit: GitCommitRef;
	    lastMergeTargetCommit: GitCommitRef;
	    mergeId: string;
	    mergeStatus: PullRequestAsyncStatus;
	    pullRequestId: number;
	    remoteUrl: string;
	    repository: GitRepository;
	    reviewers: IdentityRefWithVote[];
	    sourceRefName: string;
	    status: PullRequestStatus;
	    targetRefName: string;
	    title: string;
	    upgraded: boolean;
	    url: string;
	    workItemRefs: VSSInterfaces.ResourceRef[];
	}
	export interface GitPullRequestCompletionOptions {
	    deleteSourceBranch: boolean;
	    mergeCommitMessage: string;
	    squashMerge: boolean;
	}
	export interface GitPullRequestSearchCriteria {
	    creatorId: string;
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    repositoryId: string;
	    reviewerId: string;
	    sourceRefName: string;
	    status: PullRequestStatus;
	    targetRefName: string;
	}
	export interface GitPush extends GitPushRef {
	    commits: GitCommitRef[];
	    refUpdates: GitRefUpdate[];
	    repository: GitRepository;
	}
	export interface GitPushEventData {
	    afterId: string;
	    beforeId: string;
	    branch: string;
	    commits: GitCommit[];
	    repository: GitRepository;
	}
	export interface GitPushRef {
	    _links: any;
	    date: Date;
	    pushCorrelationId: string;
	    pushedBy: VSSInterfaces.IdentityRef;
	    pushId: number;
	    url: string;
	}
	export interface GitPushSearchCriteria {
	    fromDate: Date;
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    includeRefUpdates: boolean;
	    pusherId: string;
	    refName: string;
	    toDate: Date;
	}
	export interface GitQueryCommitsCriteria {
	    /**
	     * Number of entries to skip
	     */
	    $skip: number;
	    /**
	     * Maximum number of entries to retrieve
	     */
	    $top: number;
	    /**
	     * Alias or display name of the author
	     */
	    author: string;
	    /**
	     * If provided, the earliest commit in the graph to search
	     */
	    compareVersion: GitVersionDescriptor;
	    /**
	     * If true, don't include delete history entries
	     */
	    excludeDeletes: boolean;
	    /**
	     * If provided, a lower bound for filtering commits alphabetically
	     */
	    fromCommitId: string;
	    /**
	     * If provided, only include history entries created after this date (string)
	     */
	    fromDate: string;
	    /**
	     * If provided, specifies the exact commit ids of the commits to fetch. May not be combined with other parameters.
	     */
	    ids: string[];
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    /**
	     * Path of item to search under
	     */
	    itemPath: string;
	    /**
	     * If provided, identifies the commit or branch to search
	     */
	    itemVersion: GitVersionDescriptor;
	    /**
	     * If provided, an upper bound for filtering commits alphabetically
	     */
	    toCommitId: string;
	    /**
	     * If provided, only include history entries created before this date (string)
	     */
	    toDate: string;
	    /**
	     * Alias or display name of the committer
	     */
	    user: string;
	}
	export interface GitRef {
	    _links: any;
	    isLockedBy: VSSInterfaces.IdentityRef;
	    name: string;
	    objectId: string;
	    statuses: GitStatus[];
	    url: string;
	}
	export interface GitRefUpdate {
	    name: string;
	    newObjectId: string;
	    oldObjectId: string;
	    repositoryId: string;
	}
	export enum GitRefUpdateMode {
	    /**
	     * Indicates the Git protocol model where any refs that can be updated will be updated, but any failures will not prevent other updates from succeeding.
	     */
	    BestEffort = 0,
	    /**
	     * Indicates that all ref updates must succeed or none will succeed. All ref updates will be atomically written. If any failure is encountered, previously successful updates will be rolled back and the entire operation will fail.
	     */
	    AllOrNone = 1,
	}
	export interface GitRefUpdateResult {
	    /**
	     * Custom message for the result object For instance, Reason for failing.
	     */
	    customMessage: string;
	    /**
	     * Ref name
	     */
	    name: string;
	    /**
	     * New object ID
	     */
	    newObjectId: string;
	    /**
	     * Old object ID
	     */
	    oldObjectId: string;
	    /**
	     * Name of the plugin that rejected the updated.
	     */
	    rejectedBy: string;
	    /**
	     * Repository ID
	     */
	    repositoryId: string;
	    /**
	     * True if the ref update succeeded, false otherwise
	     */
	    success: boolean;
	    /**
	     * Status of the update from the TFS server.
	     */
	    updateStatus: GitRefUpdateStatus;
	}
	export interface GitRefUpdateResultSet {
	    countFailed: number;
	    countSucceeded: number;
	    pushCorrelationId: string;
	    pushIds: {
	        [key: string]: number;
	    };
	    pushTime: Date;
	    results: GitRefUpdateResult[];
	}
	export enum GitRefUpdateStatus {
	    /**
	     * Indicates that the ref update request was completed successfully.
	     */
	    Succeeded = 0,
	    /**
	     * Indicates that the ref update request could not be completed because part of the graph would be disconnected by this change, and the caller does not have ForcePush permission on the repository.
	     */
	    ForcePushRequired = 1,
	    /**
	     * Indicates that the ref update request could not be completed because the old object ID presented in the request was not the object ID of the ref when the database attempted the update. The most likely scenario is that the caller lost a race to update the ref.
	     */
	    StaleOldObjectId = 2,
	    /**
	     * Indicates that the ref update request could not be completed because the ref name presented in the request was not valid.
	     */
	    InvalidRefName = 3,
	    /**
	     * The request was not processed
	     */
	    Unprocessed = 4,
	    /**
	     * The ref update request could not be completed because the new object ID for the ref could not be resolved to a commit object (potentially through any number of tags)
	     */
	    UnresolvableToCommit = 5,
	    /**
	     * The ref update request could not be completed because the user lacks write permissions required to write this ref
	     */
	    WritePermissionRequired = 6,
	    /**
	     * The ref update request could not be completed because the user lacks note creation permissions required to write this note
	     */
	    ManageNotePermissionRequired = 7,
	    /**
	     * The ref update request could not be completed because the user lacks the permission to create a branch
	     */
	    CreateBranchPermissionRequired = 8,
	    /**
	     * The ref update request could not be completed because the user lacks the permission to create a tag
	     */
	    CreateTagPermissionRequired = 9,
	    /**
	     * The ref update could not be completed because it was rejected by the plugin.
	     */
	    RejectedByPlugin = 10,
	    /**
	     * The ref update could not be completed because the ref is locked by another user.
	     */
	    Locked = 11,
	    /**
	     * The ref update could not be completed because, in case-insensitive mode, the ref name conflicts with an existing, differently-cased ref name.
	     */
	    RefNameConflict = 12,
	    /**
	     * The ref update could not be completed because it was rejected by policy.
	     */
	    RejectedByPolicy = 13,
	    /**
	     * Indicates that the ref update request was completed successfully, but the ref doesn't actually exist so no changes were made.  This should only happen during deletes.
	     */
	    SucceededNonExistentRef = 14,
	    /**
	     * Indicates that the ref update request was completed successfully, but the passed-in ref was corrupt - as in, the old object ID was bad.  This should only happen during deletes.
	     */
	    SucceededCorruptRef = 15,
	}
	export interface GitRepository {
	    _links: any;
	    defaultBranch: string;
	    id: string;
	    name: string;
	    project: TfsCoreInterfaces.TeamProjectReference;
	    remoteUrl: string;
	    url: string;
	}
	export enum GitRepositoryPermissions {
	    None = 0,
	    Administer = 1,
	    GenericRead = 2,
	    GenericContribute = 4,
	    ForcePush = 8,
	    CreateBranch = 16,
	    CreateTag = 32,
	    ManageNote = 64,
	    PolicyExempt = 128,
	    /**
	     * This defines the set of bits that are valid for the git permission space. When reading or writing git permissions, these are the only bits paid attention too.
	     */
	    All = 255,
	    BranchLevelPermissions = 141,
	}
	export interface GitStatus {
	    _links: any;
	    context: GitStatusContext;
	    createdBy: VSSInterfaces.IdentityRef;
	    creationDate: Date;
	    description: string;
	    state: GitStatusState;
	    targetUrl: string;
	}
	export interface GitStatusContext {
	    genre: string;
	    name: string;
	}
	export enum GitStatusState {
	    NotSet = 0,
	    Pending = 1,
	    Succeeded = 2,
	    Failed = 3,
	    Error = 4,
	}
	export interface GitSuggestion {
	    properties: {
	        [key: string]: any;
	    };
	    type: string;
	}
	export interface GitTargetVersionDescriptor extends GitVersionDescriptor {
	    /**
	     * Version string identifier (name of tag/branch, SHA1 of commit)
	     */
	    targetVersion: string;
	    /**
	     * Version options - Specify additional modifiers to version (e.g Previous)
	     */
	    targetVersionOptions: GitVersionOptions;
	    /**
	     * Version type (branch, tag, or commit). Determines how Id is interpreted
	     */
	    targetVersionType: GitVersionType;
	}
	export interface GitTreeEntryRef {
	    /**
	     * Blob or tree
	     */
	    gitObjectType: GitObjectType;
	    /**
	     * Mode represented as octal string
	     */
	    mode: string;
	    /**
	     * SHA1 hash of git object
	     */
	    objectId: string;
	    /**
	     * Path relative to parent tree object
	     */
	    relativePath: string;
	    /**
	     * Size of content
	     */
	    size: number;
	    /**
	     * url to retrieve tree or blob
	     */
	    url: string;
	}
	export interface GitTreeRef {
	    _links: any;
	    /**
	     * SHA1 hash of git object
	     */
	    objectId: string;
	    /**
	     * Sum of sizes of all children
	     */
	    size: number;
	    /**
	     * Blobs and trees under this tree
	     */
	    treeEntries: GitTreeEntryRef[];
	    /**
	     * Url to tree
	     */
	    url: string;
	}
	export interface GitUserDate {
	    date: Date;
	    email: string;
	    name: string;
	}
	export interface GitVersionDescriptor {
	    /**
	     * Version string identifier (name of tag/branch/index, SHA1 of commit)
	     */
	    version: string;
	    /**
	     * Version options - Specify additional modifiers to version (e.g Previous)
	     */
	    versionOptions: GitVersionOptions;
	    /**
	     * Version type (branch, tag, commit, or index). Determines how Id is interpreted
	     */
	    versionType: GitVersionType;
	}
	export enum GitVersionOptions {
	    /**
	     * Not specified
	     */
	    None = 0,
	    /**
	     * Commit that changed item prior to the current version
	     */
	    PreviousChange = 1,
	    /**
	     * First parent of commit (HEAD^)
	     */
	    FirstParent = 2,
	}
	export enum GitVersionType {
	    /**
	     * Interpret the version as a branch name
	     */
	    Branch = 0,
	    /**
	     * Interpret the version as a tag name
	     */
	    Tag = 1,
	    /**
	     * Interpret the version as a commit ID (SHA1)
	     */
	    Commit = 2,
	    /**
	     * Interpret the version as an index name
	     */
	    Index = 3,
	}
	export interface HistoryEntry<T> {
	    /**
	     * The Change list (changeset/commit/shelveset) for this point in history
	     */
	    changeList: ChangeList<T>;
	    /**
	     * The change made to the item from this change list (only relevant for File history, not folders)
	     */
	    itemChangeType: VersionControlChangeType;
	    /**
	     * The path of the item at this point in history (only relevant for File history, not folders)
	     */
	    serverItem: string;
	}
	export interface HistoryQueryResults<T> {
	    /**
	     * True if there are more results available to fetch (we're returning the max # of items requested) A more RESTy solution would be to include a Link header
	     */
	    moreResultsAvailable: boolean;
	    /**
	     * The history entries (results) from this query
	     */
	    results: HistoryEntry<T>[];
	}
	export interface IdentityRefWithVote extends VSSInterfaces.IdentityRef {
	    isRequired: boolean;
	    reviewerUrl: string;
	    vote: number;
	    votedFor: IdentityRefWithVote[];
	}
	export interface IncludedGitCommit {
	    commitId: string;
	    commitTime: Date;
	    parentCommitIds: string[];
	    repositoryId: string;
	}
	export interface ItemContent {
	    content: string;
	    contentType: ItemContentType;
	}
	export enum ItemContentType {
	    RawText = 0,
	    Base64Encoded = 1,
	}
	/**
	 * Optional details to include when returning an item model
	 */
	export interface ItemDetailsOptions {
	    /**
	     * If true, include metadata about the file type
	     */
	    includeContentMetadata: boolean;
	    /**
	     * Specifies whether to include children (OneLevel), all descendants (Full) or None for folder items
	     */
	    recursionLevel: VersionControlRecursionType;
	}
	export interface ItemModel {
	    _links: any;
	    contentMetadata: FileContentMetadata;
	    isFolder: boolean;
	    isSymLink: boolean;
	    path: string;
	    url: string;
	}
	export enum PullRequestAsyncStatus {
	    NotSet = 0,
	    Queued = 1,
	    Conflicts = 2,
	    Succeeded = 3,
	    RejectedByPolicy = 4,
	    Failure = 5,
	}
	export enum PullRequestStatus {
	    NotSet = 0,
	    Active = 1,
	    Abandoned = 2,
	    Completed = 3,
	    All = 4,
	}
	export interface TfvcBranch extends TfvcBranchRef {
	    children: TfvcBranch[];
	    mappings: TfvcBranchMapping[];
	    parent: TfvcShallowBranchRef;
	    relatedBranches: TfvcShallowBranchRef[];
	}
	export interface TfvcBranchMapping {
	    depth: string;
	    serverItem: string;
	    type: string;
	}
	export interface TfvcBranchRef extends TfvcShallowBranchRef {
	    _links: any;
	    createdDate: Date;
	    description: string;
	    isDeleted: boolean;
	    owner: VSSInterfaces.IdentityRef;
	    url: string;
	}
	export interface TfvcChange extends Change<TfvcItem> {
	    /**
	     * List of merge sources in case of rename or branch creation.
	     */
	    mergeSources: TfvcMergeSource[];
	    /**
	     * Version at which a (shelved) change was pended against
	     */
	    pendingVersion: number;
	}
	export interface TfvcChangeset extends TfvcChangesetRef {
	    accountId: string;
	    changes: TfvcChange[];
	    checkinNotes: CheckinNote[];
	    collectionId: string;
	    hasMoreChanges: boolean;
	    policyOverride: TfvcPolicyOverrideInfo;
	    teamProjectIds: string[];
	    workItems: AssociatedWorkItem[];
	}
	export interface TfvcChangesetRef {
	    _links: any;
	    author: VSSInterfaces.IdentityRef;
	    changesetId: number;
	    checkedInBy: VSSInterfaces.IdentityRef;
	    comment: string;
	    commentTruncated: boolean;
	    createdDate: Date;
	    url: string;
	}
	/**
	 * Criteria used in a search for change lists
	 */
	export interface TfvcChangesetSearchCriteria {
	    /**
	     * Alias or display name of user who made the changes
	     */
	    author: string;
	    /**
	     * Whether or not to follow renames for the given item being queried
	     */
	    followRenames: boolean;
	    /**
	     * If provided, only include changesets created after this date (string) Think of a better name for this.
	     */
	    fromDate: string;
	    /**
	     * If provided, only include changesets after this changesetID
	     */
	    fromId: number;
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    /**
	     * Path of item to search under
	     */
	    path: string;
	    /**
	     * If provided, only include changesets created before this date (string) Think of a better name for this.
	     */
	    toDate: string;
	    /**
	     * If provided, a version descriptor for the latest change list to include
	     */
	    toId: number;
	}
	export interface TfvcChangesetsRequestData {
	    changesetIds: number[];
	    commentLength: number;
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	}
	export interface TfvcCheckinEventData {
	    changeset: TfvcChangeset;
	    project: TfsCoreInterfaces.TeamProjectReference;
	}
	export interface TfvcHistoryEntry extends HistoryEntry<TfvcItem> {
	    /**
	     * The encoding of the item at this point in history (only relevant for File history, not folders)
	     */
	    encoding: number;
	    /**
	     * The file id of the item at this point in history (only relevant for File history, not folders)
	     */
	    fileId: number;
	}
	export interface TfvcItem extends ItemModel {
	    changeDate: Date;
	    deletionId: number;
	    /**
	     * MD5 hash as a base 64 string, applies to files only.
	     */
	    hashValue: string;
	    isBranch: boolean;
	    isPendingChange: boolean;
	    /**
	     * The size of the file, if applicable.
	     */
	    size: number;
	    version: number;
	}
	/**
	 * Item path and Version descriptor properties
	 */
	export interface TfvcItemDescriptor {
	    path: string;
	    recursionLevel: VersionControlRecursionType;
	    version: string;
	    versionOption: TfvcVersionOption;
	    versionType: TfvcVersionType;
	}
	export interface TfvcItemRequestData {
	    /**
	     * If true, include metadata about the file type
	     */
	    includeContentMetadata: boolean;
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    itemDescriptors: TfvcItemDescriptor[];
	}
	export interface TfvcLabel extends TfvcLabelRef {
	    items: TfvcItem[];
	}
	export interface TfvcLabelRef {
	    _links: any;
	    description: string;
	    id: number;
	    labelScope: string;
	    modifiedDate: Date;
	    name: string;
	    owner: VSSInterfaces.IdentityRef;
	    url: string;
	}
	export interface TfvcLabelRequestData {
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    itemLabelFilter: string;
	    labelScope: string;
	    maxItemCount: number;
	    name: string;
	    owner: string;
	}
	export interface TfvcMergeSource {
	    /**
	     * Indicates if this a rename source. If false, it is a merge source.
	     */
	    isRename: boolean;
	    /**
	     * The server item of the merge source
	     */
	    serverItem: string;
	    /**
	     * Start of the version range
	     */
	    versionFrom: number;
	    /**
	     * End of the version range
	     */
	    versionTo: number;
	}
	export interface TfvcPolicyFailureInfo {
	    message: string;
	    policyName: string;
	}
	export interface TfvcPolicyOverrideInfo {
	    comment: string;
	    policyFailures: TfvcPolicyFailureInfo[];
	}
	export interface TfvcShallowBranchRef {
	    path: string;
	}
	export interface TfvcShelveset extends TfvcShelvesetRef {
	    changes: TfvcChange[];
	    notes: CheckinNote[];
	    policyOverride: TfvcPolicyOverrideInfo;
	    workItems: AssociatedWorkItem[];
	}
	export interface TfvcShelvesetRef {
	    _links: any;
	    comment: string;
	    commentTruncated: boolean;
	    createdDate: Date;
	    id: string;
	    name: string;
	    owner: VSSInterfaces.IdentityRef;
	    url: string;
	}
	export interface TfvcShelvesetRequestData {
	    /**
	     * Whether to include policyOverride and notes
	     */
	    includeDetails: boolean;
	    /**
	     * Whether to include the _links field on the shallow references
	     */
	    includeLinks: boolean;
	    /**
	     * Whether to include workItems
	     */
	    includeWorkItems: boolean;
	    /**
	     * Max number of changes to include
	     */
	    maxChangeCount: number;
	    /**
	     * Max length of comment
	     */
	    maxCommentLength: number;
	    /**
	     * Shelveset's name
	     */
	    name: string;
	    /**
	     * Owner's ID. Could be a name or a guid.
	     */
	    owner: string;
	}
	export interface TfvcVersionDescriptor {
	    version: string;
	    versionOption: TfvcVersionOption;
	    versionType: TfvcVersionType;
	}
	export enum TfvcVersionOption {
	    None = 0,
	    Previous = 1,
	    UseRename = 2,
	}
	export enum TfvcVersionType {
	    None = 0,
	    Changeset = 1,
	    Shelveset = 2,
	    Change = 3,
	    Date = 4,
	    Latest = 5,
	    Tip = 6,
	    MergeSource = 7,
	}
	export interface UpdateRefsRequest {
	    refUpdateRequests: GitRefUpdate[];
	    updateMode: GitRefUpdateMode;
	}
	export enum VersionControlChangeType {
	    None = 0,
	    Add = 1,
	    Edit = 2,
	    Encoding = 4,
	    Rename = 8,
	    Delete = 16,
	    Undelete = 32,
	    Branch = 64,
	    Merge = 128,
	    Lock = 256,
	    Rollback = 512,
	    SourceRename = 1024,
	    TargetRename = 2048,
	    Property = 4096,
	    All = 8191,
	}
	export interface VersionControlProjectInfo {
	    defaultSourceControlType: TfsCoreInterfaces.SourceControlTypes;
	    project: TfsCoreInterfaces.TeamProjectReference;
	    supportsGit: boolean;
	    supportsTFVC: boolean;
	}
	export enum VersionControlRecursionType {
	    /**
	     * Only return the specified item.
	     */
	    None = 0,
	    /**
	     * Return the specified item and its direct children.
	     */
	    OneLevel = 1,
	    /**
	     * Return the specified item and its direct children, as well as recursive chains of nested child folders that only contain a single folder.
	     */
	    OneLevelPlusNestedEmptyFolders = 4,
	    /**
	     * Return specified item and all descendants
	     */
	    Full = 120,
	}
	export var TypeInfo: {
	    AssociatedWorkItem: {
	        fields: any;
	    };
	    Change: {
	        fields: any;
	    };
	    ChangeCountDictionary: {
	        fields: any;
	    };
	    ChangeList: {
	        fields: any;
	    };
	    ChangeListSearchCriteria: {
	        fields: any;
	    };
	    CheckinNote: {
	        fields: any;
	    };
	    FileContentMetadata: {
	        fields: any;
	    };
	    GitBaseVersionDescriptor: {
	        fields: any;
	    };
	    GitBlobRef: {
	        fields: any;
	    };
	    GitBranchStats: {
	        fields: any;
	    };
	    GitChange: {
	        fields: any;
	    };
	    GitCommit: {
	        fields: any;
	    };
	    GitCommitChanges: {
	        fields: any;
	    };
	    GitCommitDiffs: {
	        fields: any;
	    };
	    GitCommitRef: {
	        fields: any;
	    };
	    GitCommitToCreate: {
	        fields: any;
	    };
	    GitDeletedRepository: {
	        fields: any;
	    };
	    GitHistoryQueryResults: {
	        fields: any;
	    };
	    GitItem: {
	        fields: any;
	    };
	    GitItemDescriptor: {
	        fields: any;
	    };
	    GitItemRequestData: {
	        fields: any;
	    };
	    GitLimitedRefCriteria: {
	        fields: any;
	    };
	    GitObjectType: {
	        enumValues: {
	            "bad": number;
	            "commit": number;
	            "tree": number;
	            "blob": number;
	            "tag": number;
	            "ext2": number;
	            "ofsDelta": number;
	            "refDelta": number;
	        };
	    };
	    GitPathAction: {
	        fields: any;
	    };
	    GitPathActions: {
	        enumValues: {
	            "none": number;
	            "edit": number;
	            "delete": number;
	            "add": number;
	            "rename": number;
	        };
	    };
	    GitPermissionScope: {
	        enumValues: {
	            "project": number;
	            "repository": number;
	            "branch": number;
	        };
	    };
	    GitPullRequest: {
	        fields: any;
	    };
	    GitPullRequestCompletionOptions: {
	        fields: any;
	    };
	    GitPullRequestSearchCriteria: {
	        fields: any;
	    };
	    GitPush: {
	        fields: any;
	    };
	    GitPushEventData: {
	        fields: any;
	    };
	    GitPushRef: {
	        fields: any;
	    };
	    GitPushSearchCriteria: {
	        fields: any;
	    };
	    GitQueryCommitsCriteria: {
	        fields: any;
	    };
	    GitRef: {
	        fields: any;
	    };
	    GitRefUpdate: {
	        fields: any;
	    };
	    GitRefUpdateMode: {
	        enumValues: {
	            "bestEffort": number;
	            "allOrNone": number;
	        };
	    };
	    GitRefUpdateResult: {
	        fields: any;
	    };
	    GitRefUpdateResultSet: {
	        fields: any;
	    };
	    GitRefUpdateStatus: {
	        enumValues: {
	            "succeeded": number;
	            "forcePushRequired": number;
	            "staleOldObjectId": number;
	            "invalidRefName": number;
	            "unprocessed": number;
	            "unresolvableToCommit": number;
	            "writePermissionRequired": number;
	            "manageNotePermissionRequired": number;
	            "createBranchPermissionRequired": number;
	            "createTagPermissionRequired": number;
	            "rejectedByPlugin": number;
	            "locked": number;
	            "refNameConflict": number;
	            "rejectedByPolicy": number;
	            "succeededNonExistentRef": number;
	            "succeededCorruptRef": number;
	        };
	    };
	    GitRepository: {
	        fields: any;
	    };
	    GitRepositoryPermissions: {
	        enumValues: {
	            "none": number;
	            "administer": number;
	            "genericRead": number;
	            "genericContribute": number;
	            "forcePush": number;
	            "createBranch": number;
	            "createTag": number;
	            "manageNote": number;
	            "policyExempt": number;
	            "all": number;
	            "branchLevelPermissions": number;
	        };
	    };
	    GitStatus: {
	        fields: any;
	    };
	    GitStatusContext: {
	        fields: any;
	    };
	    GitStatusState: {
	        enumValues: {
	            "notSet": number;
	            "pending": number;
	            "succeeded": number;
	            "failed": number;
	            "error": number;
	        };
	    };
	    GitSuggestion: {
	        fields: any;
	    };
	    GitTargetVersionDescriptor: {
	        fields: any;
	    };
	    GitTreeEntryRef: {
	        fields: any;
	    };
	    GitTreeRef: {
	        fields: any;
	    };
	    GitUserDate: {
	        fields: any;
	    };
	    GitVersionDescriptor: {
	        fields: any;
	    };
	    GitVersionOptions: {
	        enumValues: {
	            "none": number;
	            "previousChange": number;
	            "firstParent": number;
	        };
	    };
	    GitVersionType: {
	        enumValues: {
	            "branch": number;
	            "tag": number;
	            "commit": number;
	            "index": number;
	        };
	    };
	    HistoryEntry: {
	        fields: any;
	    };
	    HistoryQueryResults: {
	        fields: any;
	    };
	    IdentityRefWithVote: {
	        fields: any;
	    };
	    IncludedGitCommit: {
	        fields: any;
	    };
	    ItemContent: {
	        fields: any;
	    };
	    ItemContentType: {
	        enumValues: {
	            "rawText": number;
	            "base64Encoded": number;
	        };
	    };
	    ItemDetailsOptions: {
	        fields: any;
	    };
	    ItemModel: {
	        fields: any;
	    };
	    PullRequestAsyncStatus: {
	        enumValues: {
	            "notSet": number;
	            "queued": number;
	            "conflicts": number;
	            "succeeded": number;
	            "rejectedByPolicy": number;
	            "failure": number;
	        };
	    };
	    PullRequestStatus: {
	        enumValues: {
	            "notSet": number;
	            "active": number;
	            "abandoned": number;
	            "completed": number;
	            "all": number;
	        };
	    };
	    TfvcBranch: {
	        fields: any;
	    };
	    TfvcBranchMapping: {
	        fields: any;
	    };
	    TfvcBranchRef: {
	        fields: any;
	    };
	    TfvcChange: {
	        fields: any;
	    };
	    TfvcChangeset: {
	        fields: any;
	    };
	    TfvcChangesetRef: {
	        fields: any;
	    };
	    TfvcChangesetSearchCriteria: {
	        fields: any;
	    };
	    TfvcChangesetsRequestData: {
	        fields: any;
	    };
	    TfvcCheckinEventData: {
	        fields: any;
	    };
	    TfvcHistoryEntry: {
	        fields: any;
	    };
	    TfvcItem: {
	        fields: any;
	    };
	    TfvcItemDescriptor: {
	        fields: any;
	    };
	    TfvcItemRequestData: {
	        fields: any;
	    };
	    TfvcLabel: {
	        fields: any;
	    };
	    TfvcLabelRef: {
	        fields: any;
	    };
	    TfvcLabelRequestData: {
	        fields: any;
	    };
	    TfvcMergeSource: {
	        fields: any;
	    };
	    TfvcPolicyFailureInfo: {
	        fields: any;
	    };
	    TfvcPolicyOverrideInfo: {
	        fields: any;
	    };
	    TfvcShallowBranchRef: {
	        fields: any;
	    };
	    TfvcShelveset: {
	        fields: any;
	    };
	    TfvcShelvesetRef: {
	        fields: any;
	    };
	    TfvcShelvesetRequestData: {
	        fields: any;
	    };
	    TfvcVersionDescriptor: {
	        fields: any;
	    };
	    TfvcVersionOption: {
	        enumValues: {
	            "none": number;
	            "previous": number;
	            "useRename": number;
	        };
	    };
	    TfvcVersionType: {
	        enumValues: {
	            "none": number;
	            "changeset": number;
	            "shelveset": number;
	            "change": number;
	            "date": number;
	            "latest": number;
	            "tip": number;
	            "mergeSource": number;
	        };
	    };
	    UpdateRefsRequest: {
	        fields: any;
	    };
	    VersionControlChangeType: {
	        enumValues: {
	            "none": number;
	            "add": number;
	            "edit": number;
	            "encoding": number;
	            "rename": number;
	            "delete": number;
	            "undelete": number;
	            "branch": number;
	            "merge": number;
	            "lock": number;
	            "rollback": number;
	            "sourceRename": number;
	            "targetRename": number;
	            "property": number;
	            "all": number;
	        };
	    };
	    VersionControlProjectInfo: {
	        fields: any;
	    };
	    VersionControlRecursionType: {
	        enumValues: {
	            "none": number;
	            "oneLevel": number;
	            "oneLevelPlusNestedEmptyFolders": number;
	            "full": number;
	        };
	    };
	};

}
declare module 'vso-node-api/TfvcApi' {
	/// <reference path="../node/node.d.ts" />
	/// <reference path="../q/Q.d.ts" />
	import Q = require('q');
	import basem = require('vso-node-api/ClientApiBases');
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	import TfvcInterfaces = require('vso-node-api/interfaces/TfvcInterfaces');
	export interface ITfvcApi extends basem.ClientApiBase {
	    getBranch(path: string, project: string, includeParent: boolean, includeChildren: boolean, onResult: (err: any, statusCode: number, Branche: TfvcInterfaces.TfvcBranch) => void): void;
	    getBranches(project: string, includeParent: boolean, includeChildren: boolean, includeDeleted: boolean, includeLinks: boolean, onResult: (err: any, statusCode: number, Branches: TfvcInterfaces.TfvcBranch[]) => void): void;
	    getBranchRefs(scopePath: string, project: string, includeDeleted: boolean, includeLinks: boolean, onResult: (err: any, statusCode: number, Branches: TfvcInterfaces.TfvcBranchRef[]) => void): void;
	    getChangesetChanges(id: number, skip: number, top: number, onResult: (err: any, statusCode: number, ChangesetChanges: TfvcInterfaces.TfvcChange[]) => void): void;
	    createChangeset(changeset: TfvcInterfaces.TfvcChangeset, project: string, onResult: (err: any, statusCode: number, Changeset: TfvcInterfaces.TfvcChangesetRef) => void): void;
	    getChangeset(id: number, project: string, maxChangeCount: number, includeDetails: boolean, includeWorkItems: boolean, maxCommentLength: number, includeSourceRename: boolean, skip: number, top: number, orderby: string, searchCriteria: TfvcInterfaces.TfvcChangesetSearchCriteria, onResult: (err: any, statusCode: number, Changeset: TfvcInterfaces.TfvcChangeset) => void): void;
	    getChangesets(project: string, maxChangeCount: number, includeDetails: boolean, includeWorkItems: boolean, maxCommentLength: number, includeSourceRename: boolean, skip: number, top: number, orderby: string, searchCriteria: TfvcInterfaces.TfvcChangesetSearchCriteria, onResult: (err: any, statusCode: number, Changesets: TfvcInterfaces.TfvcChangesetRef[]) => void): void;
	    getBatchedChangesets(changesetsRequestData: TfvcInterfaces.TfvcChangesetsRequestData, onResult: (err: any, statusCode: number, ChangesetsBatch: TfvcInterfaces.TfvcChangesetRef[]) => void): void;
	    getChangesetWorkItems(id: number, onResult: (err: any, statusCode: number, ChangesetWorkItems: TfvcInterfaces.AssociatedWorkItem[]) => void): void;
	    getItemsBatch(itemRequestData: TfvcInterfaces.TfvcItemRequestData, project: string, onResult: (err: any, statusCode: number, ItemBatch: TfvcInterfaces.TfvcItem[][]) => void): void;
	    getItemsBatchZip(itemRequestData: TfvcInterfaces.TfvcItemRequestData, project: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getItem(path: string, project: string, fileName: string, download: boolean, scopePath: string, recursionLevel: TfvcInterfaces.VersionControlRecursionType, versionDescriptor: TfvcInterfaces.TfvcVersionDescriptor, onResult: (err: any, statusCode: number, Item: TfvcInterfaces.TfvcItem) => void): void;
	    getItemContent(path: string, project: string, fileName: string, download: boolean, scopePath: string, recursionLevel: TfvcInterfaces.VersionControlRecursionType, versionDescriptor: TfvcInterfaces.TfvcVersionDescriptor, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getItems(project: string, scopePath: string, recursionLevel: TfvcInterfaces.VersionControlRecursionType, includeLinks: boolean, versionDescriptor: TfvcInterfaces.TfvcVersionDescriptor, onResult: (err: any, statusCode: number, Items: TfvcInterfaces.TfvcItem[]) => void): void;
	    getItemText(path: string, project: string, fileName: string, download: boolean, scopePath: string, recursionLevel: TfvcInterfaces.VersionControlRecursionType, versionDescriptor: TfvcInterfaces.TfvcVersionDescriptor, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getItemZip(path: string, project: string, fileName: string, download: boolean, scopePath: string, recursionLevel: TfvcInterfaces.VersionControlRecursionType, versionDescriptor: TfvcInterfaces.TfvcVersionDescriptor, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getLabelItems(labelId: string, top: number, skip: number, onResult: (err: any, statusCode: number, LabelItems: TfvcInterfaces.TfvcItem[]) => void): void;
	    getLabel(labelId: string, requestData: TfvcInterfaces.TfvcLabelRequestData, project: string, onResult: (err: any, statusCode: number, Label: TfvcInterfaces.TfvcLabel) => void): void;
	    getLabels(requestData: TfvcInterfaces.TfvcLabelRequestData, project: string, top: number, skip: number, onResult: (err: any, statusCode: number, Labels: TfvcInterfaces.TfvcLabelRef[]) => void): void;
	    getShelvesetChanges(shelvesetId: string, top: number, skip: number, onResult: (err: any, statusCode: number, ShelvesetChanges: TfvcInterfaces.TfvcChange[]) => void): void;
	    getShelveset(shelvesetId: string, requestData: TfvcInterfaces.TfvcShelvesetRequestData, onResult: (err: any, statusCode: number, Shelveset: TfvcInterfaces.TfvcShelveset) => void): void;
	    getShelvesets(requestData: TfvcInterfaces.TfvcShelvesetRequestData, top: number, skip: number, onResult: (err: any, statusCode: number, Shelvesets: TfvcInterfaces.TfvcShelvesetRef[]) => void): void;
	    getShelvesetWorkItems(shelvesetId: string, onResult: (err: any, statusCode: number, ShelvesetWorkItems: TfvcInterfaces.AssociatedWorkItem[]) => void): void;
	}
	export interface IQTfvcApi extends basem.QClientApiBase {
	    getBranch(path: string, project?: string, includeParent?: boolean, includeChildren?: boolean): Q.Promise<TfvcInterfaces.TfvcBranch>;
	    getBranches(project?: string, includeParent?: boolean, includeChildren?: boolean, includeDeleted?: boolean, includeLinks?: boolean): Q.Promise<TfvcInterfaces.TfvcBranch[]>;
	    getBranchRefs(scopePath: string, project?: string, includeDeleted?: boolean, includeLinks?: boolean): Q.Promise<TfvcInterfaces.TfvcBranchRef[]>;
	    getChangesetChanges(id?: number, skip?: number, top?: number): Q.Promise<TfvcInterfaces.TfvcChange[]>;
	    createChangeset(changeset: TfvcInterfaces.TfvcChangeset, project?: string): Q.Promise<TfvcInterfaces.TfvcChangesetRef>;
	    getChangeset(id: number, project?: string, maxChangeCount?: number, includeDetails?: boolean, includeWorkItems?: boolean, maxCommentLength?: number, includeSourceRename?: boolean, skip?: number, top?: number, orderby?: string, searchCriteria?: TfvcInterfaces.TfvcChangesetSearchCriteria): Q.Promise<TfvcInterfaces.TfvcChangeset>;
	    getChangesets(project?: string, maxChangeCount?: number, includeDetails?: boolean, includeWorkItems?: boolean, maxCommentLength?: number, includeSourceRename?: boolean, skip?: number, top?: number, orderby?: string, searchCriteria?: TfvcInterfaces.TfvcChangesetSearchCriteria): Q.Promise<TfvcInterfaces.TfvcChangesetRef[]>;
	    getBatchedChangesets(changesetsRequestData: TfvcInterfaces.TfvcChangesetsRequestData): Q.Promise<TfvcInterfaces.TfvcChangesetRef[]>;
	    getChangesetWorkItems(id?: number): Q.Promise<TfvcInterfaces.AssociatedWorkItem[]>;
	    getItemsBatch(itemRequestData: TfvcInterfaces.TfvcItemRequestData, project?: string): Q.Promise<TfvcInterfaces.TfvcItem[][]>;
	    getItemsBatchZip(itemRequestData: TfvcInterfaces.TfvcItemRequestData, project?: string): Q.Promise<NodeJS.ReadableStream>;
	    getItem(path: string, project?: string, fileName?: string, download?: boolean, scopePath?: string, recursionLevel?: TfvcInterfaces.VersionControlRecursionType, versionDescriptor?: TfvcInterfaces.TfvcVersionDescriptor): Q.Promise<TfvcInterfaces.TfvcItem>;
	    getItemContent(path: string, project?: string, fileName?: string, download?: boolean, scopePath?: string, recursionLevel?: TfvcInterfaces.VersionControlRecursionType, versionDescriptor?: TfvcInterfaces.TfvcVersionDescriptor): Q.Promise<NodeJS.ReadableStream>;
	    getItems(project?: string, scopePath?: string, recursionLevel?: TfvcInterfaces.VersionControlRecursionType, includeLinks?: boolean, versionDescriptor?: TfvcInterfaces.TfvcVersionDescriptor): Q.Promise<TfvcInterfaces.TfvcItem[]>;
	    getItemText(path: string, project?: string, fileName?: string, download?: boolean, scopePath?: string, recursionLevel?: TfvcInterfaces.VersionControlRecursionType, versionDescriptor?: TfvcInterfaces.TfvcVersionDescriptor): Q.Promise<NodeJS.ReadableStream>;
	    getItemZip(path: string, project?: string, fileName?: string, download?: boolean, scopePath?: string, recursionLevel?: TfvcInterfaces.VersionControlRecursionType, versionDescriptor?: TfvcInterfaces.TfvcVersionDescriptor): Q.Promise<NodeJS.ReadableStream>;
	    getLabelItems(labelId: string, top?: number, skip?: number): Q.Promise<TfvcInterfaces.TfvcItem[]>;
	    getLabel(labelId: string, requestData: TfvcInterfaces.TfvcLabelRequestData, project?: string): Q.Promise<TfvcInterfaces.TfvcLabel>;
	    getLabels(requestData: TfvcInterfaces.TfvcLabelRequestData, project?: string, top?: number, skip?: number): Q.Promise<TfvcInterfaces.TfvcLabelRef[]>;
	    getShelvesetChanges(shelvesetId: string, top?: number, skip?: number): Q.Promise<TfvcInterfaces.TfvcChange[]>;
	    getShelveset(shelvesetId: string, requestData: TfvcInterfaces.TfvcShelvesetRequestData): Q.Promise<TfvcInterfaces.TfvcShelveset>;
	    getShelvesets(requestData: TfvcInterfaces.TfvcShelvesetRequestData, top?: number, skip?: number): Q.Promise<TfvcInterfaces.TfvcShelvesetRef[]>;
	    getShelvesetWorkItems(shelvesetId: string): Q.Promise<TfvcInterfaces.AssociatedWorkItem[]>;
	}
	export class TfvcApi extends basem.ClientApiBase implements ITfvcApi {
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	     * Get a single branch hierarchy at the given path with parents or children (if specified)
	     *
	     * @param {string} path
	     * @param {string} project - Project ID or project name
	     * @param {boolean} includeParent
	     * @param {boolean} includeChildren
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcBranch
	     */
	    getBranch(path: string, project: string, includeParent: boolean, includeChildren: boolean, onResult: (err: any, statusCode: number, Branche: TfvcInterfaces.TfvcBranch) => void): void;
	    /**
	     * Get a collection of branch roots -- first-level children, branches with no parents
	     *
	     * @param {string} project - Project ID or project name
	     * @param {boolean} includeParent
	     * @param {boolean} includeChildren
	     * @param {boolean} includeDeleted
	     * @param {boolean} includeLinks
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcBranch[]
	     */
	    getBranches(project: string, includeParent: boolean, includeChildren: boolean, includeDeleted: boolean, includeLinks: boolean, onResult: (err: any, statusCode: number, Branches: TfvcInterfaces.TfvcBranch[]) => void): void;
	    /**
	     * Get branch hierarchies below the specified scopePath
	     *
	     * @param {string} scopePath
	     * @param {string} project - Project ID or project name
	     * @param {boolean} includeDeleted
	     * @param {boolean} includeLinks
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcBranchRef[]
	     */
	    getBranchRefs(scopePath: string, project: string, includeDeleted: boolean, includeLinks: boolean, onResult: (err: any, statusCode: number, Branches: TfvcInterfaces.TfvcBranchRef[]) => void): void;
	    /**
	     * Retrieve Tfvc changes for a given changeset
	     *
	     * @param {number} id
	     * @param {number} skip
	     * @param {number} top
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcChange[]
	     */
	    getChangesetChanges(id: number, skip: number, top: number, onResult: (err: any, statusCode: number, ChangesetChanges: TfvcInterfaces.TfvcChange[]) => void): void;
	    /**
	     * @param {TfvcInterfaces.TfvcChangeset} changeset
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcChangesetRef
	     */
	    createChangeset(changeset: TfvcInterfaces.TfvcChangeset, project: string, onResult: (err: any, statusCode: number, Changeset: TfvcInterfaces.TfvcChangesetRef) => void): void;
	    /**
	     * Retrieve a Tfvc Changeset
	     *
	     * @param {number} id
	     * @param {string} project - Project ID or project name
	     * @param {number} maxChangeCount
	     * @param {boolean} includeDetails
	     * @param {boolean} includeWorkItems
	     * @param {number} maxCommentLength
	     * @param {boolean} includeSourceRename
	     * @param {number} skip
	     * @param {number} top
	     * @param {string} orderby
	     * @param {TfvcInterfaces.TfvcChangesetSearchCriteria} searchCriteria
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcChangeset
	     */
	    getChangeset(id: number, project: string, maxChangeCount: number, includeDetails: boolean, includeWorkItems: boolean, maxCommentLength: number, includeSourceRename: boolean, skip: number, top: number, orderby: string, searchCriteria: TfvcInterfaces.TfvcChangesetSearchCriteria, onResult: (err: any, statusCode: number, Changeset: TfvcInterfaces.TfvcChangeset) => void): void;
	    /**
	     * Retrieve Tfvc changesets
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} maxChangeCount
	     * @param {boolean} includeDetails
	     * @param {boolean} includeWorkItems
	     * @param {number} maxCommentLength
	     * @param {boolean} includeSourceRename
	     * @param {number} skip
	     * @param {number} top
	     * @param {string} orderby
	     * @param {TfvcInterfaces.TfvcChangesetSearchCriteria} searchCriteria
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcChangesetRef[]
	     */
	    getChangesets(project: string, maxChangeCount: number, includeDetails: boolean, includeWorkItems: boolean, maxCommentLength: number, includeSourceRename: boolean, skip: number, top: number, orderby: string, searchCriteria: TfvcInterfaces.TfvcChangesetSearchCriteria, onResult: (err: any, statusCode: number, Changesets: TfvcInterfaces.TfvcChangesetRef[]) => void): void;
	    /**
	     * @param {TfvcInterfaces.TfvcChangesetsRequestData} changesetsRequestData
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcChangesetRef[]
	     */
	    getBatchedChangesets(changesetsRequestData: TfvcInterfaces.TfvcChangesetsRequestData, onResult: (err: any, statusCode: number, ChangesetsBatch: TfvcInterfaces.TfvcChangesetRef[]) => void): void;
	    /**
	     * @param {number} id
	     * @param onResult callback function with the resulting TfvcInterfaces.AssociatedWorkItem[]
	     */
	    getChangesetWorkItems(id: number, onResult: (err: any, statusCode: number, ChangesetWorkItems: TfvcInterfaces.AssociatedWorkItem[]) => void): void;
	    /**
	     * Post for retrieving a set of items given a list of paths or a long path. Allows for specifying the recursionLevel and version descriptors for each path.
	     *
	     * @param {TfvcInterfaces.TfvcItemRequestData} itemRequestData
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcItem[][]
	     */
	    getItemsBatch(itemRequestData: TfvcInterfaces.TfvcItemRequestData, project: string, onResult: (err: any, statusCode: number, ItemBatch: TfvcInterfaces.TfvcItem[][]) => void): void;
	    /**
	     * Post for retrieving a set of items given a list of paths or a long path. Allows for specifying the recursionLevel and version descriptors for each path.
	     *
	     * @param {TfvcInterfaces.TfvcItemRequestData} itemRequestData
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getItemsBatchZip(itemRequestData: TfvcInterfaces.TfvcItemRequestData, project: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Get Item Metadata and/or Content. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	     *
	     * @param {string} path
	     * @param {string} project - Project ID or project name
	     * @param {string} fileName
	     * @param {boolean} download
	     * @param {string} scopePath
	     * @param {TfvcInterfaces.VersionControlRecursionType} recursionLevel
	     * @param {TfvcInterfaces.TfvcVersionDescriptor} versionDescriptor
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcItem
	     */
	    getItem(path: string, project: string, fileName: string, download: boolean, scopePath: string, recursionLevel: TfvcInterfaces.VersionControlRecursionType, versionDescriptor: TfvcInterfaces.TfvcVersionDescriptor, onResult: (err: any, statusCode: number, Item: TfvcInterfaces.TfvcItem) => void): void;
	    /**
	     * Get Item Metadata and/or Content. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	     *
	     * @param {string} path
	     * @param {string} project - Project ID or project name
	     * @param {string} fileName
	     * @param {boolean} download
	     * @param {string} scopePath
	     * @param {TfvcInterfaces.VersionControlRecursionType} recursionLevel
	     * @param {TfvcInterfaces.TfvcVersionDescriptor} versionDescriptor
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getItemContent(path: string, project: string, fileName: string, download: boolean, scopePath: string, recursionLevel: TfvcInterfaces.VersionControlRecursionType, versionDescriptor: TfvcInterfaces.TfvcVersionDescriptor, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Get a list of Tfvc items
	     *
	     * @param {string} project - Project ID or project name
	     * @param {string} scopePath
	     * @param {TfvcInterfaces.VersionControlRecursionType} recursionLevel
	     * @param {boolean} includeLinks
	     * @param {TfvcInterfaces.TfvcVersionDescriptor} versionDescriptor
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcItem[]
	     */
	    getItems(project: string, scopePath: string, recursionLevel: TfvcInterfaces.VersionControlRecursionType, includeLinks: boolean, versionDescriptor: TfvcInterfaces.TfvcVersionDescriptor, onResult: (err: any, statusCode: number, Items: TfvcInterfaces.TfvcItem[]) => void): void;
	    /**
	     * Get Item Metadata and/or Content. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	     *
	     * @param {string} path
	     * @param {string} project - Project ID or project name
	     * @param {string} fileName
	     * @param {boolean} download
	     * @param {string} scopePath
	     * @param {TfvcInterfaces.VersionControlRecursionType} recursionLevel
	     * @param {TfvcInterfaces.TfvcVersionDescriptor} versionDescriptor
	     * @param onResult callback function with the resulting string
	     */
	    getItemText(path: string, project: string, fileName: string, download: boolean, scopePath: string, recursionLevel: TfvcInterfaces.VersionControlRecursionType, versionDescriptor: TfvcInterfaces.TfvcVersionDescriptor, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Get Item Metadata and/or Content. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	     *
	     * @param {string} path
	     * @param {string} project - Project ID or project name
	     * @param {string} fileName
	     * @param {boolean} download
	     * @param {string} scopePath
	     * @param {TfvcInterfaces.VersionControlRecursionType} recursionLevel
	     * @param {TfvcInterfaces.TfvcVersionDescriptor} versionDescriptor
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getItemZip(path: string, project: string, fileName: string, download: boolean, scopePath: string, recursionLevel: TfvcInterfaces.VersionControlRecursionType, versionDescriptor: TfvcInterfaces.TfvcVersionDescriptor, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Get items under a label.
	     *
	     * @param {string} labelId - Unique identifier of label
	     * @param {number} top - Max number of items to return
	     * @param {number} skip - Number of items to skip
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcItem[]
	     */
	    getLabelItems(labelId: string, top: number, skip: number, onResult: (err: any, statusCode: number, LabelItems: TfvcInterfaces.TfvcItem[]) => void): void;
	    /**
	     * Get a single deep label.
	     *
	     * @param {string} labelId - Unique identifier of label
	     * @param {TfvcInterfaces.TfvcLabelRequestData} requestData - maxItemCount
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcLabel
	     */
	    getLabel(labelId: string, requestData: TfvcInterfaces.TfvcLabelRequestData, project: string, onResult: (err: any, statusCode: number, Label: TfvcInterfaces.TfvcLabel) => void): void;
	    /**
	     * Get a collection of shallow label references.
	     *
	     * @param {TfvcInterfaces.TfvcLabelRequestData} requestData - labelScope, name, owner, and itemLabelFilter
	     * @param {string} project - Project ID or project name
	     * @param {number} top - Max number of labels to return
	     * @param {number} skip - Number of labels to skip
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcLabelRef[]
	     */
	    getLabels(requestData: TfvcInterfaces.TfvcLabelRequestData, project: string, top: number, skip: number, onResult: (err: any, statusCode: number, Labels: TfvcInterfaces.TfvcLabelRef[]) => void): void;
	    /**
	     * Get changes included in a shelveset.
	     *
	     * @param {string} shelvesetId - Shelveset's unique ID
	     * @param {number} top - Max number of changes to return
	     * @param {number} skip - Number of changes to skip
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcChange[]
	     */
	    getShelvesetChanges(shelvesetId: string, top: number, skip: number, onResult: (err: any, statusCode: number, ShelvesetChanges: TfvcInterfaces.TfvcChange[]) => void): void;
	    /**
	     * Get a single deep shelveset.
	     *
	     * @param {string} shelvesetId - Shelveset's unique ID
	     * @param {TfvcInterfaces.TfvcShelvesetRequestData} requestData - includeDetails, includeWorkItems, maxChangeCount, and maxCommentLength
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcShelveset
	     */
	    getShelveset(shelvesetId: string, requestData: TfvcInterfaces.TfvcShelvesetRequestData, onResult: (err: any, statusCode: number, Shelveset: TfvcInterfaces.TfvcShelveset) => void): void;
	    /**
	     * Return a collection of shallow shelveset references.
	     *
	     * @param {TfvcInterfaces.TfvcShelvesetRequestData} requestData - name, owner, and maxCommentLength
	     * @param {number} top - Max number of shelvesets to return
	     * @param {number} skip - Number of shelvesets to skip
	     * @param onResult callback function with the resulting TfvcInterfaces.TfvcShelvesetRef[]
	     */
	    getShelvesets(requestData: TfvcInterfaces.TfvcShelvesetRequestData, top: number, skip: number, onResult: (err: any, statusCode: number, Shelvesets: TfvcInterfaces.TfvcShelvesetRef[]) => void): void;
	    /**
	     * Get work items associated with a shelveset.
	     *
	     * @param {string} shelvesetId - Shelveset's unique ID
	     * @param onResult callback function with the resulting TfvcInterfaces.AssociatedWorkItem[]
	     */
	    getShelvesetWorkItems(shelvesetId: string, onResult: (err: any, statusCode: number, ShelvesetWorkItems: TfvcInterfaces.AssociatedWorkItem[]) => void): void;
	}
	export class QTfvcApi extends basem.QClientApiBase implements IQTfvcApi {
	    api: TfvcApi;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	    * Get a single branch hierarchy at the given path with parents or children (if specified)
	    *
	    * @param {string} path
	    * @param {string} project - Project ID or project name
	    * @param {boolean} includeParent
	    * @param {boolean} includeChildren
	    */
	    getBranch(path: string, project?: string, includeParent?: boolean, includeChildren?: boolean): Q.Promise<TfvcInterfaces.TfvcBranch>;
	    /**
	    * Get a collection of branch roots -- first-level children, branches with no parents
	    *
	    * @param {string} project - Project ID or project name
	    * @param {boolean} includeParent
	    * @param {boolean} includeChildren
	    * @param {boolean} includeDeleted
	    * @param {boolean} includeLinks
	    */
	    getBranches(project?: string, includeParent?: boolean, includeChildren?: boolean, includeDeleted?: boolean, includeLinks?: boolean): Q.Promise<TfvcInterfaces.TfvcBranch[]>;
	    /**
	    * Get branch hierarchies below the specified scopePath
	    *
	    * @param {string} scopePath
	    * @param {string} project - Project ID or project name
	    * @param {boolean} includeDeleted
	    * @param {boolean} includeLinks
	    */
	    getBranchRefs(scopePath: string, project?: string, includeDeleted?: boolean, includeLinks?: boolean): Q.Promise<TfvcInterfaces.TfvcBranchRef[]>;
	    /**
	    * Retrieve Tfvc changes for a given changeset
	    *
	    * @param {number} id
	    * @param {number} skip
	    * @param {number} top
	    */
	    getChangesetChanges(id?: number, skip?: number, top?: number): Q.Promise<TfvcInterfaces.TfvcChange[]>;
	    /**
	    * @param {TfvcInterfaces.TfvcChangeset} changeset
	    * @param {string} project - Project ID or project name
	    */
	    createChangeset(changeset: TfvcInterfaces.TfvcChangeset, project?: string): Q.Promise<TfvcInterfaces.TfvcChangesetRef>;
	    /**
	    * Retrieve a Tfvc Changeset
	    *
	    * @param {number} id
	    * @param {string} project - Project ID or project name
	    * @param {number} maxChangeCount
	    * @param {boolean} includeDetails
	    * @param {boolean} includeWorkItems
	    * @param {number} maxCommentLength
	    * @param {boolean} includeSourceRename
	    * @param {number} skip
	    * @param {number} top
	    * @param {string} orderby
	    * @param {TfvcInterfaces.TfvcChangesetSearchCriteria} searchCriteria
	    */
	    getChangeset(id: number, project?: string, maxChangeCount?: number, includeDetails?: boolean, includeWorkItems?: boolean, maxCommentLength?: number, includeSourceRename?: boolean, skip?: number, top?: number, orderby?: string, searchCriteria?: TfvcInterfaces.TfvcChangesetSearchCriteria): Q.Promise<TfvcInterfaces.TfvcChangeset>;
	    /**
	    * Retrieve Tfvc changesets
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} maxChangeCount
	    * @param {boolean} includeDetails
	    * @param {boolean} includeWorkItems
	    * @param {number} maxCommentLength
	    * @param {boolean} includeSourceRename
	    * @param {number} skip
	    * @param {number} top
	    * @param {string} orderby
	    * @param {TfvcInterfaces.TfvcChangesetSearchCriteria} searchCriteria
	    */
	    getChangesets(project?: string, maxChangeCount?: number, includeDetails?: boolean, includeWorkItems?: boolean, maxCommentLength?: number, includeSourceRename?: boolean, skip?: number, top?: number, orderby?: string, searchCriteria?: TfvcInterfaces.TfvcChangesetSearchCriteria): Q.Promise<TfvcInterfaces.TfvcChangesetRef[]>;
	    /**
	    * @param {TfvcInterfaces.TfvcChangesetsRequestData} changesetsRequestData
	    */
	    getBatchedChangesets(changesetsRequestData: TfvcInterfaces.TfvcChangesetsRequestData): Q.Promise<TfvcInterfaces.TfvcChangesetRef[]>;
	    /**
	    * @param {number} id
	    */
	    getChangesetWorkItems(id?: number): Q.Promise<TfvcInterfaces.AssociatedWorkItem[]>;
	    /**
	    * Post for retrieving a set of items given a list of paths or a long path. Allows for specifying the recursionLevel and version descriptors for each path.
	    *
	    * @param {TfvcInterfaces.TfvcItemRequestData} itemRequestData
	    * @param {string} project - Project ID or project name
	    */
	    getItemsBatch(itemRequestData: TfvcInterfaces.TfvcItemRequestData, project?: string): Q.Promise<TfvcInterfaces.TfvcItem[][]>;
	    /**
	    * Post for retrieving a set of items given a list of paths or a long path. Allows for specifying the recursionLevel and version descriptors for each path.
	    *
	    * @param {TfvcInterfaces.TfvcItemRequestData} itemRequestData
	    * @param {string} project - Project ID or project name
	    */
	    getItemsBatchZip(itemRequestData: TfvcInterfaces.TfvcItemRequestData, project?: string): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Get Item Metadata and/or Content. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	    *
	    * @param {string} path
	    * @param {string} project - Project ID or project name
	    * @param {string} fileName
	    * @param {boolean} download
	    * @param {string} scopePath
	    * @param {TfvcInterfaces.VersionControlRecursionType} recursionLevel
	    * @param {TfvcInterfaces.TfvcVersionDescriptor} versionDescriptor
	    */
	    getItem(path: string, project?: string, fileName?: string, download?: boolean, scopePath?: string, recursionLevel?: TfvcInterfaces.VersionControlRecursionType, versionDescriptor?: TfvcInterfaces.TfvcVersionDescriptor): Q.Promise<TfvcInterfaces.TfvcItem>;
	    /**
	    * Get Item Metadata and/or Content. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	    *
	    * @param {string} path
	    * @param {string} project - Project ID or project name
	    * @param {string} fileName
	    * @param {boolean} download
	    * @param {string} scopePath
	    * @param {TfvcInterfaces.VersionControlRecursionType} recursionLevel
	    * @param {TfvcInterfaces.TfvcVersionDescriptor} versionDescriptor
	    */
	    getItemContent(path: string, project?: string, fileName?: string, download?: boolean, scopePath?: string, recursionLevel?: TfvcInterfaces.VersionControlRecursionType, versionDescriptor?: TfvcInterfaces.TfvcVersionDescriptor): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Get a list of Tfvc items
	    *
	    * @param {string} project - Project ID or project name
	    * @param {string} scopePath
	    * @param {TfvcInterfaces.VersionControlRecursionType} recursionLevel
	    * @param {boolean} includeLinks
	    * @param {TfvcInterfaces.TfvcVersionDescriptor} versionDescriptor
	    */
	    getItems(project?: string, scopePath?: string, recursionLevel?: TfvcInterfaces.VersionControlRecursionType, includeLinks?: boolean, versionDescriptor?: TfvcInterfaces.TfvcVersionDescriptor): Q.Promise<TfvcInterfaces.TfvcItem[]>;
	    /**
	    * Get Item Metadata and/or Content. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	    *
	    * @param {string} path
	    * @param {string} project - Project ID or project name
	    * @param {string} fileName
	    * @param {boolean} download
	    * @param {string} scopePath
	    * @param {TfvcInterfaces.VersionControlRecursionType} recursionLevel
	    * @param {TfvcInterfaces.TfvcVersionDescriptor} versionDescriptor
	    */
	    getItemText(path: string, project?: string, fileName?: string, download?: boolean, scopePath?: string, recursionLevel?: TfvcInterfaces.VersionControlRecursionType, versionDescriptor?: TfvcInterfaces.TfvcVersionDescriptor): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Get Item Metadata and/or Content. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download.
	    *
	    * @param {string} path
	    * @param {string} project - Project ID or project name
	    * @param {string} fileName
	    * @param {boolean} download
	    * @param {string} scopePath
	    * @param {TfvcInterfaces.VersionControlRecursionType} recursionLevel
	    * @param {TfvcInterfaces.TfvcVersionDescriptor} versionDescriptor
	    */
	    getItemZip(path: string, project?: string, fileName?: string, download?: boolean, scopePath?: string, recursionLevel?: TfvcInterfaces.VersionControlRecursionType, versionDescriptor?: TfvcInterfaces.TfvcVersionDescriptor): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Get items under a label.
	    *
	    * @param {string} labelId - Unique identifier of label
	    * @param {number} top - Max number of items to return
	    * @param {number} skip - Number of items to skip
	    */
	    getLabelItems(labelId: string, top?: number, skip?: number): Q.Promise<TfvcInterfaces.TfvcItem[]>;
	    /**
	    * Get a single deep label.
	    *
	    * @param {string} labelId - Unique identifier of label
	    * @param {TfvcInterfaces.TfvcLabelRequestData} requestData - maxItemCount
	    * @param {string} project - Project ID or project name
	    */
	    getLabel(labelId: string, requestData: TfvcInterfaces.TfvcLabelRequestData, project?: string): Q.Promise<TfvcInterfaces.TfvcLabel>;
	    /**
	    * Get a collection of shallow label references.
	    *
	    * @param {TfvcInterfaces.TfvcLabelRequestData} requestData - labelScope, name, owner, and itemLabelFilter
	    * @param {string} project - Project ID or project name
	    * @param {number} top - Max number of labels to return
	    * @param {number} skip - Number of labels to skip
	    */
	    getLabels(requestData: TfvcInterfaces.TfvcLabelRequestData, project?: string, top?: number, skip?: number): Q.Promise<TfvcInterfaces.TfvcLabelRef[]>;
	    /**
	    * Get changes included in a shelveset.
	    *
	    * @param {string} shelvesetId - Shelveset's unique ID
	    * @param {number} top - Max number of changes to return
	    * @param {number} skip - Number of changes to skip
	    */
	    getShelvesetChanges(shelvesetId: string, top?: number, skip?: number): Q.Promise<TfvcInterfaces.TfvcChange[]>;
	    /**
	    * Get a single deep shelveset.
	    *
	    * @param {string} shelvesetId - Shelveset's unique ID
	    * @param {TfvcInterfaces.TfvcShelvesetRequestData} requestData - includeDetails, includeWorkItems, maxChangeCount, and maxCommentLength
	    */
	    getShelveset(shelvesetId: string, requestData: TfvcInterfaces.TfvcShelvesetRequestData): Q.Promise<TfvcInterfaces.TfvcShelveset>;
	    /**
	    * Return a collection of shallow shelveset references.
	    *
	    * @param {TfvcInterfaces.TfvcShelvesetRequestData} requestData - name, owner, and maxCommentLength
	    * @param {number} top - Max number of shelvesets to return
	    * @param {number} skip - Number of shelvesets to skip
	    */
	    getShelvesets(requestData: TfvcInterfaces.TfvcShelvesetRequestData, top?: number, skip?: number): Q.Promise<TfvcInterfaces.TfvcShelvesetRef[]>;
	    /**
	    * Get work items associated with a shelveset.
	    *
	    * @param {string} shelvesetId - Shelveset's unique ID
	    */
	    getShelvesetWorkItems(shelvesetId: string): Q.Promise<TfvcInterfaces.AssociatedWorkItem[]>;
	}

}
declare module 'vso-node-api/interfaces/WorkItemTrackingInterfaces' {
	export interface AttachmentReference {
	    id: string;
	    url: string;
	}
	export interface FieldDependentRule extends WorkItemTrackingResource {
	    dependentFields: WorkItemFieldReference[];
	}
	export interface FieldsToEvaluate {
	    fields: string[];
	    fieldUpdates: {
	        [key: string]: any;
	    };
	    fieldValues: {
	        [key: string]: any;
	    };
	    rulesFrom: string[];
	}
	export enum FieldType {
	    String = 0,
	    Integer = 1,
	    DateTime = 2,
	    PlainText = 3,
	    Html = 4,
	    TreePath = 5,
	    History = 6,
	    Double = 7,
	    Guid = 8,
	    Boolean = 9,
	}
	export enum FieldUsage {
	    None = 0,
	    WorkItem = 1,
	    WorkItemLink = 2,
	    Tree = 3,
	    WorkItemTypeExtension = 4,
	}
	export interface IdentityReference {
	    id: string;
	    name: string;
	    url: string;
	}
	export interface Link {
	    attributes: {
	        [key: string]: any;
	    };
	    rel: string;
	    title: string;
	    url: string;
	}
	export enum LinkQueryMode {
	    WorkItems = 0,
	    LinksOneHopMustContain = 1,
	    LinksOneHopMayContain = 2,
	    LinksOneHopDoesNotContain = 3,
	    LinksRecursiveMustContain = 4,
	    LinksRecursiveMayContain = 5,
	    LinksRecursiveDoesNotContain = 6,
	}
	export enum LogicalOperation {
	    NONE = 0,
	    AND = 1,
	    OR = 2,
	}
	export interface ProjectReference {
	    id: string;
	    name: string;
	    url: string;
	}
	export enum ProvisioningActionType {
	    Import = 0,
	    Validate = 1,
	}
	export interface ProvisioningResult {
	    provisioningImportEvents: string[];
	}
	export enum QueryExpand {
	    None = 0,
	    Wiql = 1,
	    Clauses = 2,
	    All = 3,
	}
	export interface QueryHierarchyItem extends WorkItemTrackingResource {
	    children: QueryHierarchyItem[];
	    clauses: WorkItemQueryClause;
	    columns: WorkItemFieldReference[];
	    filterOptions: LinkQueryMode;
	    hasChildren: boolean;
	    id: string;
	    isDeleted: boolean;
	    isFolder: boolean;
	    isInvalidSyntax: boolean;
	    isPublic: boolean;
	    linkClauses: WorkItemQueryClause;
	    name: string;
	    path: string;
	    queryType: QueryType;
	    sortColumns: WorkItemQuerySortColumn[];
	    sourceClauses: WorkItemQueryClause;
	    targetClauses: WorkItemQueryClause;
	    wiql: string;
	}
	export enum QueryResultType {
	    WorkItem = 1,
	    WorkItemLink = 2,
	}
	export enum QueryType {
	    Flat = 1,
	    Tree = 2,
	    OneHop = 3,
	}
	export interface ReportingWorkItemLink {
	    changedDate: Date;
	    isActive: boolean;
	    rel: string;
	    sourceId: number;
	    targetId: number;
	}
	export interface ReportingWorkItemLinksBatch extends StreamedBatch<ReportingWorkItemLink> {
	}
	export interface ReportingWorkItemRevisionsBatch extends StreamedBatch<WorkItem> {
	}
	export interface ReportingWorkItemRevisionsFilter {
	    /**
	     * A list of fields to return in work item revisions. Omit this parameter to get all reportable fields.
	     */
	    fields: string[];
	    /**
	     * Return an identity reference instead of a string value for identity fields.
	     */
	    includeIdentityRef: boolean;
	    /**
	     * A list of types to filter the results to specific work item types. Omit this parameter to get work item revisions of all work item types.
	     */
	    types: string[];
	}
	export interface StreamedBatch<T> {
	    continuationToken: string;
	    isLastBatch: boolean;
	    nextLink: string;
	    values: T[];
	}
	export enum TemplateType {
	    WorkItemType = 0,
	    GlobalWorkflow = 1,
	}
	export enum TreeNodeStructureType {
	    Area = 0,
	    Iteration = 1,
	}
	export enum TreeStructureGroup {
	    Areas = 0,
	    Iterations = 1,
	}
	export interface Wiql {
	    query: string;
	}
	export interface WitBatchRequest {
	    body: string;
	    headers: {
	        [key: string]: string;
	    };
	    method: string;
	    uri: string;
	}
	export interface WitBatchResponse {
	    body: string;
	    code: number;
	    headers: {
	        [key: string]: string;
	    };
	}
	export interface WorkItem extends WorkItemTrackingResource {
	    fields: {
	        [key: string]: any;
	    };
	    id: number;
	    relations: WorkItemRelation[];
	    rev: number;
	}
	export interface WorkItemClassificationNode extends WorkItemTrackingResource {
	    attributes: {
	        [key: string]: any;
	    };
	    children: WorkItemClassificationNode[];
	    id: number;
	    identifier: string;
	    name: string;
	    structureType: TreeNodeStructureType;
	}
	export interface WorkItemDelete extends WorkItemDeleteReference {
	    resource: WorkItem;
	}
	export interface WorkItemDeleteReference {
	    code: number;
	    deletedBy: string;
	    deletedDate: string;
	    id: number;
	    message: string;
	    name: string;
	    project: string;
	    type: string;
	    url: string;
	}
	export interface WorkItemDeleteUpdate {
	    isDeleted: boolean;
	}
	export enum WorkItemExpand {
	    None = 0,
	    Relations = 1,
	    Fields = 2,
	    All = 3,
	}
	export interface WorkItemField extends WorkItemTrackingResource {
	    name: string;
	    readOnly: boolean;
	    referenceName: string;
	    supportedOperations: WorkItemFieldOperation[];
	    type: FieldType;
	}
	export interface WorkItemFieldOperation {
	    name: string;
	    referenceName: string;
	}
	export interface WorkItemFieldReference {
	    name: string;
	    referenceName: string;
	    url: string;
	}
	export interface WorkItemFieldUpdate {
	    newValue: any;
	    oldValue: any;
	}
	export interface WorkItemHistory extends WorkItemTrackingResource {
	    rev: number;
	    revisedBy: IdentityReference;
	    revisedDate: Date;
	    value: string;
	}
	export interface WorkItemLink {
	    rel: string;
	    source: WorkItemReference;
	    target: WorkItemReference;
	}
	export interface WorkItemQueryClause {
	    clauses: WorkItemQueryClause[];
	    field: WorkItemFieldReference;
	    fieldValue: WorkItemFieldReference;
	    isFieldValue: boolean;
	    logicalOperator: LogicalOperation;
	    operator: WorkItemFieldOperation;
	    value: string;
	}
	export interface WorkItemQueryResult {
	    asOf: Date;
	    columns: WorkItemFieldReference[];
	    queryResultType: QueryResultType;
	    queryType: QueryType;
	    sortColumns: WorkItemQuerySortColumn[];
	    workItemRelations: WorkItemLink[];
	    workItems: WorkItemReference[];
	}
	export interface WorkItemQuerySortColumn {
	    descending: boolean;
	    field: WorkItemFieldReference;
	}
	export interface WorkItemReference {
	    id: number;
	    url: string;
	}
	export interface WorkItemRelation extends Link {
	}
	export interface WorkItemRelationType extends WorkItemTrackingReference {
	    attributes: {
	        [key: string]: any;
	    };
	}
	export interface WorkItemRelationUpdates {
	    added: WorkItemRelation[];
	    removed: WorkItemRelation[];
	    updated: WorkItemRelation[];
	}
	export interface WorkItemRevisionReference extends WorkItemReference {
	    rev: number;
	}
	export interface WorkItemTrackingReference extends WorkItemTrackingResource {
	    name: string;
	    referenceName: string;
	}
	export interface WorkItemTrackingResource extends WorkItemTrackingResourceReference {
	    _links: any;
	}
	export interface WorkItemTrackingResourceReference {
	    url: string;
	}
	export interface WorkItemType extends WorkItemTrackingResource {
	    description: string;
	    fields: WorkItemTypeFieldInstance[];
	    name: string;
	    xmlForm: string;
	}
	export interface WorkItemTypeCategory extends WorkItemTrackingResource {
	    defaultWorkItemType: WorkItemTypeReference;
	    name: string;
	    referenceName: string;
	    workItemTypes: WorkItemTypeReference[];
	}
	export interface WorkItemTypeFieldInstance {
	    field: WorkItemFieldReference;
	    helpText: string;
	}
	export interface WorkItemTypeReference extends WorkItemTrackingResourceReference {
	    name: string;
	}
	export interface WorkItemTypeTemplate {
	    template: string;
	}
	export interface WorkItemTypeTemplateUpdateModel {
	    actionType: ProvisioningActionType;
	    methodology: string;
	    template: string;
	    templateType: TemplateType;
	}
	export interface WorkItemUpdate extends WorkItemTrackingResourceReference {
	    fields: {
	        [key: string]: WorkItemFieldUpdate;
	    };
	    id: number;
	    relations: WorkItemRelationUpdates;
	    rev: number;
	    revisedBy: IdentityReference;
	    revisedDate: Date;
	    workItemId: number;
	}
	export var TypeInfo: {
	    AttachmentReference: {
	        fields: any;
	    };
	    FieldDependentRule: {
	        fields: any;
	    };
	    FieldsToEvaluate: {
	        fields: any;
	    };
	    FieldType: {
	        enumValues: {
	            "string": number;
	            "integer": number;
	            "dateTime": number;
	            "plainText": number;
	            "html": number;
	            "treePath": number;
	            "history": number;
	            "double": number;
	            "guid": number;
	            "boolean": number;
	        };
	    };
	    FieldUsage: {
	        enumValues: {
	            "none": number;
	            "workItem": number;
	            "workItemLink": number;
	            "tree": number;
	            "workItemTypeExtension": number;
	        };
	    };
	    IdentityReference: {
	        fields: any;
	    };
	    Link: {
	        fields: any;
	    };
	    LinkQueryMode: {
	        enumValues: {
	            "workItems": number;
	            "linksOneHopMustContain": number;
	            "linksOneHopMayContain": number;
	            "linksOneHopDoesNotContain": number;
	            "linksRecursiveMustContain": number;
	            "linksRecursiveMayContain": number;
	            "linksRecursiveDoesNotContain": number;
	        };
	    };
	    LogicalOperation: {
	        enumValues: {
	            "nONE": number;
	            "aND": number;
	            "oR": number;
	        };
	    };
	    ProjectReference: {
	        fields: any;
	    };
	    ProvisioningActionType: {
	        enumValues: {
	            "import": number;
	            "validate": number;
	        };
	    };
	    ProvisioningResult: {
	        fields: any;
	    };
	    QueryExpand: {
	        enumValues: {
	            "none": number;
	            "wiql": number;
	            "clauses": number;
	            "all": number;
	        };
	    };
	    QueryHierarchyItem: {
	        fields: any;
	    };
	    QueryResultType: {
	        enumValues: {
	            "workItem": number;
	            "workItemLink": number;
	        };
	    };
	    QueryType: {
	        enumValues: {
	            "flat": number;
	            "tree": number;
	            "oneHop": number;
	        };
	    };
	    ReportingWorkItemLink: {
	        fields: any;
	    };
	    ReportingWorkItemLinksBatch: {
	        fields: any;
	    };
	    ReportingWorkItemRevisionsBatch: {
	        fields: any;
	    };
	    ReportingWorkItemRevisionsFilter: {
	        fields: any;
	    };
	    StreamedBatch: {
	        fields: any;
	    };
	    TemplateType: {
	        enumValues: {
	            "workItemType": number;
	            "globalWorkflow": number;
	        };
	    };
	    TreeNodeStructureType: {
	        enumValues: {
	            "area": number;
	            "iteration": number;
	        };
	    };
	    TreeStructureGroup: {
	        enumValues: {
	            "areas": number;
	            "iterations": number;
	        };
	    };
	    Wiql: {
	        fields: any;
	    };
	    WitBatchRequest: {
	        fields: any;
	    };
	    WitBatchResponse: {
	        fields: any;
	    };
	    WorkItem: {
	        fields: any;
	    };
	    WorkItemClassificationNode: {
	        fields: any;
	    };
	    WorkItemDelete: {
	        fields: any;
	    };
	    WorkItemDeleteReference: {
	        fields: any;
	    };
	    WorkItemDeleteUpdate: {
	        fields: any;
	    };
	    WorkItemExpand: {
	        enumValues: {
	            "none": number;
	            "relations": number;
	            "fields": number;
	            "all": number;
	        };
	    };
	    WorkItemField: {
	        fields: any;
	    };
	    WorkItemFieldOperation: {
	        fields: any;
	    };
	    WorkItemFieldReference: {
	        fields: any;
	    };
	    WorkItemFieldUpdate: {
	        fields: any;
	    };
	    WorkItemHistory: {
	        fields: any;
	    };
	    WorkItemLink: {
	        fields: any;
	    };
	    WorkItemQueryClause: {
	        fields: any;
	    };
	    WorkItemQueryResult: {
	        fields: any;
	    };
	    WorkItemQuerySortColumn: {
	        fields: any;
	    };
	    WorkItemReference: {
	        fields: any;
	    };
	    WorkItemRelation: {
	        fields: any;
	    };
	    WorkItemRelationType: {
	        fields: any;
	    };
	    WorkItemRelationUpdates: {
	        fields: any;
	    };
	    WorkItemRevisionReference: {
	        fields: any;
	    };
	    WorkItemTrackingReference: {
	        fields: any;
	    };
	    WorkItemTrackingResource: {
	        fields: any;
	    };
	    WorkItemTrackingResourceReference: {
	        fields: any;
	    };
	    WorkItemType: {
	        fields: any;
	    };
	    WorkItemTypeCategory: {
	        fields: any;
	    };
	    WorkItemTypeFieldInstance: {
	        fields: any;
	    };
	    WorkItemTypeReference: {
	        fields: any;
	    };
	    WorkItemTypeTemplate: {
	        fields: any;
	    };
	    WorkItemTypeTemplateUpdateModel: {
	        fields: any;
	    };
	    WorkItemUpdate: {
	        fields: any;
	    };
	};

}
declare module 'vso-node-api/WorkItemTrackingApi' {
	/// <reference path="../node/node.d.ts" />
	/// <reference path="../q/Q.d.ts" />
	import Q = require('q');
	import basem = require('vso-node-api/ClientApiBases');
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	import TfsCoreInterfaces = require('vso-node-api/interfaces/CoreInterfaces');
	import VSSInterfaces = require('vso-node-api/interfaces/common/VSSInterfaces');
	import WorkItemTrackingInterfaces = require('vso-node-api/interfaces/WorkItemTrackingInterfaces');
	export interface IWorkItemTrackingApi extends basem.ClientApiBase {
	    createAttachment(customHeaders: any, contentStream: NodeJS.ReadableStream, fileName: string, uploadType: string, onResult: (err: any, statusCode: number, attachment: WorkItemTrackingInterfaces.AttachmentReference) => void): void;
	    getAttachmentContent(id: string, fileName: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getAttachmentZip(id: string, fileName: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getRootNodes(project: string, depth: number, onResult: (err: any, statusCode: number, classificationNodes: WorkItemTrackingInterfaces.WorkItemClassificationNode[]) => void): void;
	    createOrUpdateClassificationNode(postedNode: WorkItemTrackingInterfaces.WorkItemClassificationNode, project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path: string, onResult: (err: any, statusCode: number, classificationNode: WorkItemTrackingInterfaces.WorkItemClassificationNode) => void): void;
	    deleteClassificationNode(project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path: string, reclassifyId: number, onResult: (err: any, statusCode: number) => void): void;
	    getClassificationNode(project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path: string, depth: number, onResult: (err: any, statusCode: number, classificationNode: WorkItemTrackingInterfaces.WorkItemClassificationNode) => void): void;
	    updateClassificationNode(postedNode: WorkItemTrackingInterfaces.WorkItemClassificationNode, project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path: string, onResult: (err: any, statusCode: number, classificationNode: WorkItemTrackingInterfaces.WorkItemClassificationNode) => void): void;
	    getField(field: string, onResult: (err: any, statusCode: number, field: WorkItemTrackingInterfaces.WorkItemField) => void): void;
	    getFields(onResult: (err: any, statusCode: number, fields: WorkItemTrackingInterfaces.WorkItemField[]) => void): void;
	    getHistory(id: number, top: number, skip: number, onResult: (err: any, statusCode: number, history: WorkItemTrackingInterfaces.WorkItemHistory[]) => void): void;
	    getHistoryById(id: number, revisionNumber: number, onResult: (err: any, statusCode: number, history: WorkItemTrackingInterfaces.WorkItemHistory) => void): void;
	    createQuery(postedQuery: WorkItemTrackingInterfaces.QueryHierarchyItem, project: string, query: string, onResult: (err: any, statusCode: number, querie: WorkItemTrackingInterfaces.QueryHierarchyItem) => void): void;
	    deleteQuery(project: string, query: string, onResult: (err: any, statusCode: number) => void): void;
	    getQueries(project: string, expand: WorkItemTrackingInterfaces.QueryExpand, depth: number, includeDeleted: boolean, onResult: (err: any, statusCode: number, queries: WorkItemTrackingInterfaces.QueryHierarchyItem[]) => void): void;
	    getQuery(project: string, query: string, expand: WorkItemTrackingInterfaces.QueryExpand, depth: number, includeDeleted: boolean, onResult: (err: any, statusCode: number, querie: WorkItemTrackingInterfaces.QueryHierarchyItem) => void): void;
	    updateQuery(queryUpdate: WorkItemTrackingInterfaces.QueryHierarchyItem, project: string, query: string, undeleteDescendants: boolean, onResult: (err: any, statusCode: number, querie: WorkItemTrackingInterfaces.QueryHierarchyItem) => void): void;
	    destroyWorkItem(id: number, project: string, onResult: (err: any, statusCode: number) => void): void;
	    getDeletedWorkItem(id: number, project: string, onResult: (err: any, statusCode: number, recyclebin: WorkItemTrackingInterfaces.WorkItemDelete) => void): void;
	    getDeletedWorkItems(project: string, ids: number[], onResult: (err: any, statusCode: number, recyclebin: WorkItemTrackingInterfaces.WorkItemDeleteReference[]) => void): void;
	    restoreWorkItem(payload: WorkItemTrackingInterfaces.WorkItemDeleteUpdate, id: number, project: string, onResult: (err: any, statusCode: number, recyclebin: WorkItemTrackingInterfaces.WorkItemDelete) => void): void;
	    getRevision(id: number, revisionNumber: number, expand: WorkItemTrackingInterfaces.WorkItemExpand, onResult: (err: any, statusCode: number, revision: WorkItemTrackingInterfaces.WorkItem) => void): void;
	    getRevisions(id: number, top: number, skip: number, expand: WorkItemTrackingInterfaces.WorkItemExpand, onResult: (err: any, statusCode: number, revisions: WorkItemTrackingInterfaces.WorkItem[]) => void): void;
	    evaluateRulesOnField(ruleEngineInput: WorkItemTrackingInterfaces.FieldsToEvaluate, onResult: (err: any, statusCode: number) => void): void;
	    getUpdate(id: number, updateNumber: number, onResult: (err: any, statusCode: number, update: WorkItemTrackingInterfaces.WorkItemUpdate) => void): void;
	    getUpdates(id: number, top: number, skip: number, onResult: (err: any, statusCode: number, updates: WorkItemTrackingInterfaces.WorkItemUpdate[]) => void): void;
	    queryByWiql(wiql: WorkItemTrackingInterfaces.Wiql, teamContext: TfsCoreInterfaces.TeamContext, timePrecision: boolean, onResult: (err: any, statusCode: number, wiql: WorkItemTrackingInterfaces.WorkItemQueryResult) => void): void;
	    queryById(id: string, teamContext: TfsCoreInterfaces.TeamContext, timePrecision: boolean, onResult: (err: any, statusCode: number, wiql: WorkItemTrackingInterfaces.WorkItemQueryResult) => void): void;
	    getReportingLinks(project: string, types: string[], continuationToken: string, startDateTime: Date, onResult: (err: any, statusCode: number, workItemLink: WorkItemTrackingInterfaces.ReportingWorkItemLinksBatch) => void): void;
	    getRelationType(relation: string, onResult: (err: any, statusCode: number, workItemRelationType: WorkItemTrackingInterfaces.WorkItemRelationType) => void): void;
	    getRelationTypes(onResult: (err: any, statusCode: number, workItemRelationTypes: WorkItemTrackingInterfaces.WorkItemRelationType[]) => void): void;
	    readReportingRevisionsGet(project: string, fields: string[], types: string[], continuationToken: string, startDateTime: Date, includeIdentityRef: boolean, includeDeleted: boolean, includeTagRef: boolean, onResult: (err: any, statusCode: number, workItemRevision: WorkItemTrackingInterfaces.ReportingWorkItemRevisionsBatch) => void): void;
	    readReportingRevisionsPost(filter: WorkItemTrackingInterfaces.ReportingWorkItemRevisionsFilter, project: string, continuationToken: string, startDateTime: Date, onResult: (err: any, statusCode: number, workItemRevision: WorkItemTrackingInterfaces.ReportingWorkItemRevisionsBatch) => void): void;
	    deleteWorkItem(id: number, destroy: boolean, onResult: (err: any, statusCode: number, workItem: WorkItemTrackingInterfaces.WorkItemDelete) => void): void;
	    getWorkItem(id: number, fields: string[], asOf: Date, expand: WorkItemTrackingInterfaces.WorkItemExpand, onResult: (err: any, statusCode: number, workItem: WorkItemTrackingInterfaces.WorkItem) => void): void;
	    getWorkItems(ids: number[], fields: string[], asOf: Date, expand: WorkItemTrackingInterfaces.WorkItemExpand, onResult: (err: any, statusCode: number, workItems: WorkItemTrackingInterfaces.WorkItem[]) => void): void;
	    updateWorkItem(customHeaders: any, document: VSSInterfaces.JsonPatchDocument, id: number, validateOnly: boolean, bypassRules: boolean, onResult: (err: any, statusCode: number, workItem: WorkItemTrackingInterfaces.WorkItem) => void): void;
	    createWorkItem(customHeaders: any, document: VSSInterfaces.JsonPatchDocument, project: string, type: string, validateOnly: boolean, bypassRules: boolean, onResult: (err: any, statusCode: number, workItem: WorkItemTrackingInterfaces.WorkItem) => void): void;
	    getWorkItemTemplate(project: string, type: string, fields: string, asOf: Date, expand: WorkItemTrackingInterfaces.WorkItemExpand, onResult: (err: any, statusCode: number, workItem: WorkItemTrackingInterfaces.WorkItem) => void): void;
	    getWorkItemTypeCategories(project: string, onResult: (err: any, statusCode: number, workItemTypeCategories: WorkItemTrackingInterfaces.WorkItemTypeCategory[]) => void): void;
	    getWorkItemTypeCategory(project: string, category: string, onResult: (err: any, statusCode: number, workItemTypeCategorie: WorkItemTrackingInterfaces.WorkItemTypeCategory) => void): void;
	    getWorkItemType(project: string, type: string, onResult: (err: any, statusCode: number, workItemType: WorkItemTrackingInterfaces.WorkItemType) => void): void;
	    getWorkItemTypes(project: string, onResult: (err: any, statusCode: number, workItemTypes: WorkItemTrackingInterfaces.WorkItemType[]) => void): void;
	    getDependentFields(project: string, type: string, field: string, onResult: (err: any, statusCode: number, workItemTypesField: WorkItemTrackingInterfaces.FieldDependentRule) => void): void;
	    exportWorkItemTypeDefinition(project: string, type: string, exportGlobalLists: boolean, onResult: (err: any, statusCode: number, workItemTypeTemplate: WorkItemTrackingInterfaces.WorkItemTypeTemplate) => void): void;
	    updateWorkItemTypeDefinition(updateModel: WorkItemTrackingInterfaces.WorkItemTypeTemplateUpdateModel, project: string, onResult: (err: any, statusCode: number, workItemTypeTemplate: WorkItemTrackingInterfaces.ProvisioningResult) => void): void;
	}
	export interface IQWorkItemTrackingApi extends basem.QClientApiBase {
	    createAttachment(customHeaders: any, contentStream: NodeJS.ReadableStream, fileName?: string, uploadType?: string): Q.Promise<WorkItemTrackingInterfaces.AttachmentReference>;
	    getAttachmentContent(id: string, fileName?: string): Q.Promise<NodeJS.ReadableStream>;
	    getAttachmentZip(id: string, fileName?: string): Q.Promise<NodeJS.ReadableStream>;
	    getRootNodes(project: string, depth?: number): Q.Promise<WorkItemTrackingInterfaces.WorkItemClassificationNode[]>;
	    createOrUpdateClassificationNode(postedNode: WorkItemTrackingInterfaces.WorkItemClassificationNode, project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path?: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemClassificationNode>;
	    deleteClassificationNode(project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path?: string, reclassifyId?: number): Q.Promise<void>;
	    getClassificationNode(project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path?: string, depth?: number): Q.Promise<WorkItemTrackingInterfaces.WorkItemClassificationNode>;
	    updateClassificationNode(postedNode: WorkItemTrackingInterfaces.WorkItemClassificationNode, project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path?: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemClassificationNode>;
	    getField(field: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemField>;
	    getFields(): Q.Promise<WorkItemTrackingInterfaces.WorkItemField[]>;
	    getHistory(id: number, top?: number, skip?: number): Q.Promise<WorkItemTrackingInterfaces.WorkItemHistory[]>;
	    getHistoryById(id: number, revisionNumber: number): Q.Promise<WorkItemTrackingInterfaces.WorkItemHistory>;
	    createQuery(postedQuery: WorkItemTrackingInterfaces.QueryHierarchyItem, project: string, query: string): Q.Promise<WorkItemTrackingInterfaces.QueryHierarchyItem>;
	    deleteQuery(project: string, query: string): Q.Promise<void>;
	    getQueries(project: string, expand?: WorkItemTrackingInterfaces.QueryExpand, depth?: number, includeDeleted?: boolean): Q.Promise<WorkItemTrackingInterfaces.QueryHierarchyItem[]>;
	    getQuery(project: string, query: string, expand?: WorkItemTrackingInterfaces.QueryExpand, depth?: number, includeDeleted?: boolean): Q.Promise<WorkItemTrackingInterfaces.QueryHierarchyItem>;
	    updateQuery(queryUpdate: WorkItemTrackingInterfaces.QueryHierarchyItem, project: string, query: string, undeleteDescendants?: boolean): Q.Promise<WorkItemTrackingInterfaces.QueryHierarchyItem>;
	    destroyWorkItem(id: number, project?: string): Q.Promise<void>;
	    getDeletedWorkItem(id: number, project?: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemDelete>;
	    getDeletedWorkItems(project?: string, ids?: number[]): Q.Promise<WorkItemTrackingInterfaces.WorkItemDeleteReference[]>;
	    restoreWorkItem(payload: WorkItemTrackingInterfaces.WorkItemDeleteUpdate, id: number, project?: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemDelete>;
	    getRevision(id: number, revisionNumber: number, expand?: WorkItemTrackingInterfaces.WorkItemExpand): Q.Promise<WorkItemTrackingInterfaces.WorkItem>;
	    getRevisions(id: number, top?: number, skip?: number, expand?: WorkItemTrackingInterfaces.WorkItemExpand): Q.Promise<WorkItemTrackingInterfaces.WorkItem[]>;
	    evaluateRulesOnField(ruleEngineInput: WorkItemTrackingInterfaces.FieldsToEvaluate): Q.Promise<void>;
	    getUpdate(id: number, updateNumber: number): Q.Promise<WorkItemTrackingInterfaces.WorkItemUpdate>;
	    getUpdates(id: number, top?: number, skip?: number): Q.Promise<WorkItemTrackingInterfaces.WorkItemUpdate[]>;
	    queryByWiql(wiql: WorkItemTrackingInterfaces.Wiql, teamContext?: TfsCoreInterfaces.TeamContext, timePrecision?: boolean): Q.Promise<WorkItemTrackingInterfaces.WorkItemQueryResult>;
	    queryById(id: string, teamContext?: TfsCoreInterfaces.TeamContext, timePrecision?: boolean): Q.Promise<WorkItemTrackingInterfaces.WorkItemQueryResult>;
	    getReportingLinks(project?: string, types?: string[], continuationToken?: string, startDateTime?: Date): Q.Promise<WorkItemTrackingInterfaces.ReportingWorkItemLinksBatch>;
	    getRelationType(relation: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemRelationType>;
	    getRelationTypes(): Q.Promise<WorkItemTrackingInterfaces.WorkItemRelationType[]>;
	    readReportingRevisionsGet(project?: string, fields?: string[], types?: string[], continuationToken?: string, startDateTime?: Date, includeIdentityRef?: boolean, includeDeleted?: boolean, includeTagRef?: boolean): Q.Promise<WorkItemTrackingInterfaces.ReportingWorkItemRevisionsBatch>;
	    readReportingRevisionsPost(filter: WorkItemTrackingInterfaces.ReportingWorkItemRevisionsFilter, project?: string, continuationToken?: string, startDateTime?: Date): Q.Promise<WorkItemTrackingInterfaces.ReportingWorkItemRevisionsBatch>;
	    deleteWorkItem(id: number, destroy?: boolean): Q.Promise<WorkItemTrackingInterfaces.WorkItemDelete>;
	    getWorkItem(id: number, fields?: string[], asOf?: Date, expand?: WorkItemTrackingInterfaces.WorkItemExpand): Q.Promise<WorkItemTrackingInterfaces.WorkItem>;
	    getWorkItems(ids: number[], fields?: string[], asOf?: Date, expand?: WorkItemTrackingInterfaces.WorkItemExpand): Q.Promise<WorkItemTrackingInterfaces.WorkItem[]>;
	    updateWorkItem(customHeaders: any, document: VSSInterfaces.JsonPatchDocument, id: number, validateOnly?: boolean, bypassRules?: boolean): Q.Promise<WorkItemTrackingInterfaces.WorkItem>;
	    createWorkItem(customHeaders: any, document: VSSInterfaces.JsonPatchDocument, project: string, type: string, validateOnly?: boolean, bypassRules?: boolean): Q.Promise<WorkItemTrackingInterfaces.WorkItem>;
	    getWorkItemTemplate(project: string, type: string, fields?: string, asOf?: Date, expand?: WorkItemTrackingInterfaces.WorkItemExpand): Q.Promise<WorkItemTrackingInterfaces.WorkItem>;
	    getWorkItemTypeCategories(project: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemTypeCategory[]>;
	    getWorkItemTypeCategory(project: string, category: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemTypeCategory>;
	    getWorkItemType(project: string, type: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemType>;
	    getWorkItemTypes(project: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemType[]>;
	    getDependentFields(project: string, type: string, field: string): Q.Promise<WorkItemTrackingInterfaces.FieldDependentRule>;
	    exportWorkItemTypeDefinition(project?: string, type?: string, exportGlobalLists?: boolean): Q.Promise<WorkItemTrackingInterfaces.WorkItemTypeTemplate>;
	    updateWorkItemTypeDefinition(updateModel: WorkItemTrackingInterfaces.WorkItemTypeTemplateUpdateModel, project?: string): Q.Promise<WorkItemTrackingInterfaces.ProvisioningResult>;
	}
	export class WorkItemTrackingApi extends basem.ClientApiBase implements IWorkItemTrackingApi {
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	     * Creates an attachment.
	     *
	     * @param {NodeJS.ReadableStream} contentStream - Content to upload
	     * @param {string} fileName
	     * @param {string} uploadType
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.AttachmentReference
	     */
	    createAttachment(customHeaders: VsoBaseInterfaces.IHeaders, contentStream: NodeJS.ReadableStream, fileName: string, uploadType: string, onResult: (err: any, statusCode: number, attachment: WorkItemTrackingInterfaces.AttachmentReference) => void): void;
	    /**
	     * Returns an attachment
	     *
	     * @param {string} id
	     * @param {string} fileName
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getAttachmentContent(id: string, fileName: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * Returns an attachment
	     *
	     * @param {string} id
	     * @param {string} fileName
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getAttachmentZip(id: string, fileName: string, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} depth
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemClassificationNode[]
	     */
	    getRootNodes(project: string, depth: number, onResult: (err: any, statusCode: number, classificationNodes: WorkItemTrackingInterfaces.WorkItemClassificationNode[]) => void): void;
	    /**
	     * @param {WorkItemTrackingInterfaces.WorkItemClassificationNode} postedNode
	     * @param {string} project - Project ID or project name
	     * @param {WorkItemTrackingInterfaces.TreeStructureGroup} structureGroup
	     * @param {string} path
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemClassificationNode
	     */
	    createOrUpdateClassificationNode(postedNode: WorkItemTrackingInterfaces.WorkItemClassificationNode, project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path: string, onResult: (err: any, statusCode: number, classificationNode: WorkItemTrackingInterfaces.WorkItemClassificationNode) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {WorkItemTrackingInterfaces.TreeStructureGroup} structureGroup
	     * @param {string} path
	     * @param {number} reclassifyId
	     * @param onResult callback function
	     */
	    deleteClassificationNode(project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path: string, reclassifyId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {WorkItemTrackingInterfaces.TreeStructureGroup} structureGroup
	     * @param {string} path
	     * @param {number} depth
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemClassificationNode
	     */
	    getClassificationNode(project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path: string, depth: number, onResult: (err: any, statusCode: number, classificationNode: WorkItemTrackingInterfaces.WorkItemClassificationNode) => void): void;
	    /**
	     * @param {WorkItemTrackingInterfaces.WorkItemClassificationNode} postedNode
	     * @param {string} project - Project ID or project name
	     * @param {WorkItemTrackingInterfaces.TreeStructureGroup} structureGroup
	     * @param {string} path
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemClassificationNode
	     */
	    updateClassificationNode(postedNode: WorkItemTrackingInterfaces.WorkItemClassificationNode, project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path: string, onResult: (err: any, statusCode: number, classificationNode: WorkItemTrackingInterfaces.WorkItemClassificationNode) => void): void;
	    /**
	     * @param {string} field
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemField
	     */
	    getField(field: string, onResult: (err: any, statusCode: number, field: WorkItemTrackingInterfaces.WorkItemField) => void): void;
	    /**
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemField[]
	     */
	    getFields(onResult: (err: any, statusCode: number, fields: WorkItemTrackingInterfaces.WorkItemField[]) => void): void;
	    /**
	     * Returns history of all revision for a given work item ID
	     *
	     * @param {number} id
	     * @param {number} top
	     * @param {number} skip
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemHistory[]
	     */
	    getHistory(id: number, top: number, skip: number, onResult: (err: any, statusCode: number, history: WorkItemTrackingInterfaces.WorkItemHistory[]) => void): void;
	    /**
	     * Returns the history value of particular revision
	     *
	     * @param {number} id
	     * @param {number} revisionNumber
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemHistory
	     */
	    getHistoryById(id: number, revisionNumber: number, onResult: (err: any, statusCode: number, history: WorkItemTrackingInterfaces.WorkItemHistory) => void): void;
	    /**
	     * Creates a query, or moves a query.
	     *
	     * @param {WorkItemTrackingInterfaces.QueryHierarchyItem} postedQuery - The query to create.
	     * @param {string} project - Project ID or project name
	     * @param {string} query - The parent path for the query to create.
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.QueryHierarchyItem
	     */
	    createQuery(postedQuery: WorkItemTrackingInterfaces.QueryHierarchyItem, project: string, query: string, onResult: (err: any, statusCode: number, querie: WorkItemTrackingInterfaces.QueryHierarchyItem) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {string} query
	     * @param onResult callback function
	     */
	    deleteQuery(project: string, query: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * Retrieves all queries the user has access to in the current project
	     *
	     * @param {string} project - Project ID or project name
	     * @param {WorkItemTrackingInterfaces.QueryExpand} expand
	     * @param {number} depth
	     * @param {boolean} includeDeleted
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.QueryHierarchyItem[]
	     */
	    getQueries(project: string, expand: WorkItemTrackingInterfaces.QueryExpand, depth: number, includeDeleted: boolean, onResult: (err: any, statusCode: number, queries: WorkItemTrackingInterfaces.QueryHierarchyItem[]) => void): void;
	    /**
	     * Retrieves a single query by project and either id or path
	     *
	     * @param {string} project - Project ID or project name
	     * @param {string} query
	     * @param {WorkItemTrackingInterfaces.QueryExpand} expand
	     * @param {number} depth
	     * @param {boolean} includeDeleted
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.QueryHierarchyItem
	     */
	    getQuery(project: string, query: string, expand: WorkItemTrackingInterfaces.QueryExpand, depth: number, includeDeleted: boolean, onResult: (err: any, statusCode: number, querie: WorkItemTrackingInterfaces.QueryHierarchyItem) => void): void;
	    /**
	     * @param {WorkItemTrackingInterfaces.QueryHierarchyItem} queryUpdate
	     * @param {string} project - Project ID or project name
	     * @param {string} query
	     * @param {boolean} undeleteDescendants
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.QueryHierarchyItem
	     */
	    updateQuery(queryUpdate: WorkItemTrackingInterfaces.QueryHierarchyItem, project: string, query: string, undeleteDescendants: boolean, onResult: (err: any, statusCode: number, querie: WorkItemTrackingInterfaces.QueryHierarchyItem) => void): void;
	    /**
	     * @param {number} id
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function
	     */
	    destroyWorkItem(id: number, project: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {number} id
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemDelete
	     */
	    getDeletedWorkItem(id: number, project: string, onResult: (err: any, statusCode: number, recyclebin: WorkItemTrackingInterfaces.WorkItemDelete) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number[]} ids
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemDeleteReference[]
	     */
	    getDeletedWorkItems(project: string, ids: number[], onResult: (err: any, statusCode: number, recyclebin: WorkItemTrackingInterfaces.WorkItemDeleteReference[]) => void): void;
	    /**
	     * @param {WorkItemTrackingInterfaces.WorkItemDeleteUpdate} payload
	     * @param {number} id
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemDelete
	     */
	    restoreWorkItem(payload: WorkItemTrackingInterfaces.WorkItemDeleteUpdate, id: number, project: string, onResult: (err: any, statusCode: number, recyclebin: WorkItemTrackingInterfaces.WorkItemDelete) => void): void;
	    /**
	     * Returns a fully hydrated work item for the requested revision
	     *
	     * @param {number} id
	     * @param {number} revisionNumber
	     * @param {WorkItemTrackingInterfaces.WorkItemExpand} expand
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItem
	     */
	    getRevision(id: number, revisionNumber: number, expand: WorkItemTrackingInterfaces.WorkItemExpand, onResult: (err: any, statusCode: number, revision: WorkItemTrackingInterfaces.WorkItem) => void): void;
	    /**
	     * Returns the list of fully hydrated work item revisions, paged.
	     *
	     * @param {number} id
	     * @param {number} top
	     * @param {number} skip
	     * @param {WorkItemTrackingInterfaces.WorkItemExpand} expand
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItem[]
	     */
	    getRevisions(id: number, top: number, skip: number, expand: WorkItemTrackingInterfaces.WorkItemExpand, onResult: (err: any, statusCode: number, revisions: WorkItemTrackingInterfaces.WorkItem[]) => void): void;
	    /**
	     * Validates the fields values.
	     *
	     * @param {WorkItemTrackingInterfaces.FieldsToEvaluate} ruleEngineInput
	     * @param onResult callback function
	     */
	    evaluateRulesOnField(ruleEngineInput: WorkItemTrackingInterfaces.FieldsToEvaluate, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * Returns a single update for a work item
	     *
	     * @param {number} id
	     * @param {number} updateNumber
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemUpdate
	     */
	    getUpdate(id: number, updateNumber: number, onResult: (err: any, statusCode: number, update: WorkItemTrackingInterfaces.WorkItemUpdate) => void): void;
	    /**
	     * Returns a the deltas between work item revisions
	     *
	     * @param {number} id
	     * @param {number} top
	     * @param {number} skip
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemUpdate[]
	     */
	    getUpdates(id: number, top: number, skip: number, onResult: (err: any, statusCode: number, updates: WorkItemTrackingInterfaces.WorkItemUpdate[]) => void): void;
	    /**
	     * Gets the results of the query.
	     *
	     * @param {WorkItemTrackingInterfaces.Wiql} wiql - The query containing the wiql.
	     * @param {TfsCoreInterfaces.TeamContext} teamContext - The team context for the operation
	     * @param {boolean} timePrecision
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemQueryResult
	     */
	    queryByWiql(wiql: WorkItemTrackingInterfaces.Wiql, teamContext: TfsCoreInterfaces.TeamContext, timePrecision: boolean, onResult: (err: any, statusCode: number, wiql: WorkItemTrackingInterfaces.WorkItemQueryResult) => void): void;
	    /**
	     * Gets the results of the query by id.
	     *
	     * @param {string} id - The query id.
	     * @param {TfsCoreInterfaces.TeamContext} teamContext - The team context for the operation
	     * @param {boolean} timePrecision
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemQueryResult
	     */
	    queryById(id: string, teamContext: TfsCoreInterfaces.TeamContext, timePrecision: boolean, onResult: (err: any, statusCode: number, wiql: WorkItemTrackingInterfaces.WorkItemQueryResult) => void): void;
	    /**
	     * Get a batch of work item links
	     *
	     * @param {string} project - Project ID or project name
	     * @param {string[]} types - A list of types to filter the results to specific work item types. Omit this parameter to get work item links of all work item types.
	     * @param {string} continuationToken - Specifies the continuationToken to start the batch from. Omit this parameter to get the first batch of links.
	     * @param {Date} startDateTime - Date/time to use as a starting point for link changes. Only link changes that occurred after that date/time will be returned. Cannot be used in conjunction with 'watermark' parameter.
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.ReportingWorkItemLinksBatch
	     */
	    getReportingLinks(project: string, types: string[], continuationToken: string, startDateTime: Date, onResult: (err: any, statusCode: number, workItemLink: WorkItemTrackingInterfaces.ReportingWorkItemLinksBatch) => void): void;
	    /**
	     * Gets the work item relation types.
	     *
	     * @param {string} relation
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemRelationType
	     */
	    getRelationType(relation: string, onResult: (err: any, statusCode: number, workItemRelationType: WorkItemTrackingInterfaces.WorkItemRelationType) => void): void;
	    /**
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemRelationType[]
	     */
	    getRelationTypes(onResult: (err: any, statusCode: number, workItemRelationTypes: WorkItemTrackingInterfaces.WorkItemRelationType[]) => void): void;
	    /**
	     * Get a batch of work item revisions with the option of including deleted items
	     *
	     * @param {string} project - Project ID or project name
	     * @param {string[]} fields - A list of fields to return in work item revisions. Omit this parameter to get all reportable fields.
	     * @param {string[]} types - A list of types to filter the results to specific work item types. Omit this parameter to get work item revisions of all work item types.
	     * @param {string} continuationToken - Specifies the watermark to start the batch from. Omit this parameter to get the first batch of revisions.
	     * @param {Date} startDateTime - Date/time to use as a starting point for revisions, all revisions will occur after this date/time. Cannot be used in conjunction with 'watermark' parameter.
	     * @param {boolean} includeIdentityRef - Return an identity reference instead of a string value for identity fields.
	     * @param {boolean} includeDeleted - Specify if the deleted item should be returned.
	     * @param {boolean} includeTagRef - Specify if the tag objects should be returned for System.Tags field.
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.ReportingWorkItemRevisionsBatch
	     */
	    readReportingRevisionsGet(project: string, fields: string[], types: string[], continuationToken: string, startDateTime: Date, includeIdentityRef: boolean, includeDeleted: boolean, includeTagRef: boolean, onResult: (err: any, statusCode: number, workItemRevision: WorkItemTrackingInterfaces.ReportingWorkItemRevisionsBatch) => void): void;
	    /**
	     * Get a batch of work item revisions
	     *
	     * @param {WorkItemTrackingInterfaces.ReportingWorkItemRevisionsFilter} filter - An object that contains request settings: field filter, type filter, identity format
	     * @param {string} project - Project ID or project name
	     * @param {string} continuationToken - Specifies the watermark to start the batch from. Omit this parameter to get the first batch of revisions.
	     * @param {Date} startDateTime - Date/time to use as a starting point for revisions, all revisions will occur after this date/time. Cannot be used in conjunction with 'watermark' parameter.
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.ReportingWorkItemRevisionsBatch
	     */
	    readReportingRevisionsPost(filter: WorkItemTrackingInterfaces.ReportingWorkItemRevisionsFilter, project: string, continuationToken: string, startDateTime: Date, onResult: (err: any, statusCode: number, workItemRevision: WorkItemTrackingInterfaces.ReportingWorkItemRevisionsBatch) => void): void;
	    /**
	     * @param {number} id
	     * @param {boolean} destroy
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemDelete
	     */
	    deleteWorkItem(id: number, destroy: boolean, onResult: (err: any, statusCode: number, workItem: WorkItemTrackingInterfaces.WorkItemDelete) => void): void;
	    /**
	     * Returns a single work item
	     *
	     * @param {number} id
	     * @param {string[]} fields
	     * @param {Date} asOf
	     * @param {WorkItemTrackingInterfaces.WorkItemExpand} expand
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItem
	     */
	    getWorkItem(id: number, fields: string[], asOf: Date, expand: WorkItemTrackingInterfaces.WorkItemExpand, onResult: (err: any, statusCode: number, workItem: WorkItemTrackingInterfaces.WorkItem) => void): void;
	    /**
	     * Returns a list of work items
	     *
	     * @param {number[]} ids
	     * @param {string[]} fields
	     * @param {Date} asOf
	     * @param {WorkItemTrackingInterfaces.WorkItemExpand} expand
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItem[]
	     */
	    getWorkItems(ids: number[], fields: string[], asOf: Date, expand: WorkItemTrackingInterfaces.WorkItemExpand, onResult: (err: any, statusCode: number, workItems: WorkItemTrackingInterfaces.WorkItem[]) => void): void;
	    /**
	     * @param {VSSInterfaces.JsonPatchDocument} document
	     * @param {number} id
	     * @param {boolean} validateOnly
	     * @param {boolean} bypassRules
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItem
	     */
	    updateWorkItem(customHeaders: VsoBaseInterfaces.IHeaders, document: VSSInterfaces.JsonPatchDocument, id: number, validateOnly: boolean, bypassRules: boolean, onResult: (err: any, statusCode: number, workItem: WorkItemTrackingInterfaces.WorkItem) => void): void;
	    /**
	     * @param {VSSInterfaces.JsonPatchDocument} document
	     * @param {string} project - Project ID or project name
	     * @param {string} type
	     * @param {boolean} validateOnly
	     * @param {boolean} bypassRules
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItem
	     */
	    createWorkItem(customHeaders: VsoBaseInterfaces.IHeaders, document: VSSInterfaces.JsonPatchDocument, project: string, type: string, validateOnly: boolean, bypassRules: boolean, onResult: (err: any, statusCode: number, workItem: WorkItemTrackingInterfaces.WorkItem) => void): void;
	    /**
	     * Returns a single work item from a template
	     *
	     * @param {string} project - Project ID or project name
	     * @param {string} type
	     * @param {string} fields
	     * @param {Date} asOf
	     * @param {WorkItemTrackingInterfaces.WorkItemExpand} expand
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItem
	     */
	    getWorkItemTemplate(project: string, type: string, fields: string, asOf: Date, expand: WorkItemTrackingInterfaces.WorkItemExpand, onResult: (err: any, statusCode: number, workItem: WorkItemTrackingInterfaces.WorkItem) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemTypeCategory[]
	     */
	    getWorkItemTypeCategories(project: string, onResult: (err: any, statusCode: number, workItemTypeCategories: WorkItemTrackingInterfaces.WorkItemTypeCategory[]) => void): void;
	    /**
	     * Returns a the deltas between work item revisions
	     *
	     * @param {string} project - Project ID or project name
	     * @param {string} category
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemTypeCategory
	     */
	    getWorkItemTypeCategory(project: string, category: string, onResult: (err: any, statusCode: number, workItemTypeCategorie: WorkItemTrackingInterfaces.WorkItemTypeCategory) => void): void;
	    /**
	     * Returns a the deltas between work item revisions
	     *
	     * @param {string} project - Project ID or project name
	     * @param {string} type
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemType
	     */
	    getWorkItemType(project: string, type: string, onResult: (err: any, statusCode: number, workItemType: WorkItemTrackingInterfaces.WorkItemType) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemType[]
	     */
	    getWorkItemTypes(project: string, onResult: (err: any, statusCode: number, workItemTypes: WorkItemTrackingInterfaces.WorkItemType[]) => void): void;
	    /**
	     * Returns the dependent fields for the corresponding workitem type and fieldname
	     *
	     * @param {string} project - Project ID or project name
	     * @param {string} type
	     * @param {string} field
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.FieldDependentRule
	     */
	    getDependentFields(project: string, type: string, field: string, onResult: (err: any, statusCode: number, workItemTypesField: WorkItemTrackingInterfaces.FieldDependentRule) => void): void;
	    /**
	     * Export work item type
	     *
	     * @param {string} project - Project ID or project name
	     * @param {string} type
	     * @param {boolean} exportGlobalLists
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.WorkItemTypeTemplate
	     */
	    exportWorkItemTypeDefinition(project: string, type: string, exportGlobalLists: boolean, onResult: (err: any, statusCode: number, workItemTypeTemplate: WorkItemTrackingInterfaces.WorkItemTypeTemplate) => void): void;
	    /**
	     * Add/updates a work item type
	     *
	     * @param {WorkItemTrackingInterfaces.WorkItemTypeTemplateUpdateModel} updateModel
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting WorkItemTrackingInterfaces.ProvisioningResult
	     */
	    updateWorkItemTypeDefinition(updateModel: WorkItemTrackingInterfaces.WorkItemTypeTemplateUpdateModel, project: string, onResult: (err: any, statusCode: number, workItemTypeTemplate: WorkItemTrackingInterfaces.ProvisioningResult) => void): void;
	}
	export class QWorkItemTrackingApi extends basem.QClientApiBase implements IQWorkItemTrackingApi {
	    api: WorkItemTrackingApi;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	    * Creates an attachment.
	    *
	    * @param {NodeJS.ReadableStream} contentStream - Content to upload
	    * @param {string} fileName
	    * @param {string} uploadType
	    */
	    createAttachment(customHeaders: any, contentStream: NodeJS.ReadableStream, fileName?: string, uploadType?: string): Q.Promise<WorkItemTrackingInterfaces.AttachmentReference>;
	    /**
	    * Returns an attachment
	    *
	    * @param {string} id
	    * @param {string} fileName
	    */
	    getAttachmentContent(id: string, fileName?: string): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * Returns an attachment
	    *
	    * @param {string} id
	    * @param {string} fileName
	    */
	    getAttachmentZip(id: string, fileName?: string): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} depth
	    */
	    getRootNodes(project: string, depth?: number): Q.Promise<WorkItemTrackingInterfaces.WorkItemClassificationNode[]>;
	    /**
	    * @param {WorkItemTrackingInterfaces.WorkItemClassificationNode} postedNode
	    * @param {string} project - Project ID or project name
	    * @param {WorkItemTrackingInterfaces.TreeStructureGroup} structureGroup
	    * @param {string} path
	    */
	    createOrUpdateClassificationNode(postedNode: WorkItemTrackingInterfaces.WorkItemClassificationNode, project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path?: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemClassificationNode>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {WorkItemTrackingInterfaces.TreeStructureGroup} structureGroup
	    * @param {string} path
	    * @param {number} reclassifyId
	    */
	    deleteClassificationNode(project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path?: string, reclassifyId?: number): Q.Promise<void>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {WorkItemTrackingInterfaces.TreeStructureGroup} structureGroup
	    * @param {string} path
	    * @param {number} depth
	    */
	    getClassificationNode(project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path?: string, depth?: number): Q.Promise<WorkItemTrackingInterfaces.WorkItemClassificationNode>;
	    /**
	    * @param {WorkItemTrackingInterfaces.WorkItemClassificationNode} postedNode
	    * @param {string} project - Project ID or project name
	    * @param {WorkItemTrackingInterfaces.TreeStructureGroup} structureGroup
	    * @param {string} path
	    */
	    updateClassificationNode(postedNode: WorkItemTrackingInterfaces.WorkItemClassificationNode, project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path?: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemClassificationNode>;
	    /**
	    * @param {string} field
	    */
	    getField(field: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemField>;
	    /**
	    */
	    getFields(): Q.Promise<WorkItemTrackingInterfaces.WorkItemField[]>;
	    /**
	    * Returns history of all revision for a given work item ID
	    *
	    * @param {number} id
	    * @param {number} top
	    * @param {number} skip
	    */
	    getHistory(id: number, top?: number, skip?: number): Q.Promise<WorkItemTrackingInterfaces.WorkItemHistory[]>;
	    /**
	    * Returns the history value of particular revision
	    *
	    * @param {number} id
	    * @param {number} revisionNumber
	    */
	    getHistoryById(id: number, revisionNumber: number): Q.Promise<WorkItemTrackingInterfaces.WorkItemHistory>;
	    /**
	    * Creates a query, or moves a query.
	    *
	    * @param {WorkItemTrackingInterfaces.QueryHierarchyItem} postedQuery - The query to create.
	    * @param {string} project - Project ID or project name
	    * @param {string} query - The parent path for the query to create.
	    */
	    createQuery(postedQuery: WorkItemTrackingInterfaces.QueryHierarchyItem, project: string, query: string): Q.Promise<WorkItemTrackingInterfaces.QueryHierarchyItem>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {string} query
	    */
	    deleteQuery(project: string, query: string): Q.Promise<void>;
	    /**
	    * Retrieves all queries the user has access to in the current project
	    *
	    * @param {string} project - Project ID or project name
	    * @param {WorkItemTrackingInterfaces.QueryExpand} expand
	    * @param {number} depth
	    * @param {boolean} includeDeleted
	    */
	    getQueries(project: string, expand?: WorkItemTrackingInterfaces.QueryExpand, depth?: number, includeDeleted?: boolean): Q.Promise<WorkItemTrackingInterfaces.QueryHierarchyItem[]>;
	    /**
	    * Retrieves a single query by project and either id or path
	    *
	    * @param {string} project - Project ID or project name
	    * @param {string} query
	    * @param {WorkItemTrackingInterfaces.QueryExpand} expand
	    * @param {number} depth
	    * @param {boolean} includeDeleted
	    */
	    getQuery(project: string, query: string, expand?: WorkItemTrackingInterfaces.QueryExpand, depth?: number, includeDeleted?: boolean): Q.Promise<WorkItemTrackingInterfaces.QueryHierarchyItem>;
	    /**
	    * @param {WorkItemTrackingInterfaces.QueryHierarchyItem} queryUpdate
	    * @param {string} project - Project ID or project name
	    * @param {string} query
	    * @param {boolean} undeleteDescendants
	    */
	    updateQuery(queryUpdate: WorkItemTrackingInterfaces.QueryHierarchyItem, project: string, query: string, undeleteDescendants?: boolean): Q.Promise<WorkItemTrackingInterfaces.QueryHierarchyItem>;
	    /**
	    * @param {number} id
	    * @param {string} project - Project ID or project name
	    */
	    destroyWorkItem(id: number, project?: string): Q.Promise<void>;
	    /**
	    * @param {number} id
	    * @param {string} project - Project ID or project name
	    */
	    getDeletedWorkItem(id: number, project?: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemDelete>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number[]} ids
	    */
	    getDeletedWorkItems(project?: string, ids?: number[]): Q.Promise<WorkItemTrackingInterfaces.WorkItemDeleteReference[]>;
	    /**
	    * @param {WorkItemTrackingInterfaces.WorkItemDeleteUpdate} payload
	    * @param {number} id
	    * @param {string} project - Project ID or project name
	    */
	    restoreWorkItem(payload: WorkItemTrackingInterfaces.WorkItemDeleteUpdate, id: number, project?: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemDelete>;
	    /**
	    * Returns a fully hydrated work item for the requested revision
	    *
	    * @param {number} id
	    * @param {number} revisionNumber
	    * @param {WorkItemTrackingInterfaces.WorkItemExpand} expand
	    */
	    getRevision(id: number, revisionNumber: number, expand?: WorkItemTrackingInterfaces.WorkItemExpand): Q.Promise<WorkItemTrackingInterfaces.WorkItem>;
	    /**
	    * Returns the list of fully hydrated work item revisions, paged.
	    *
	    * @param {number} id
	    * @param {number} top
	    * @param {number} skip
	    * @param {WorkItemTrackingInterfaces.WorkItemExpand} expand
	    */
	    getRevisions(id: number, top?: number, skip?: number, expand?: WorkItemTrackingInterfaces.WorkItemExpand): Q.Promise<WorkItemTrackingInterfaces.WorkItem[]>;
	    /**
	    * Validates the fields values.
	    *
	    * @param {WorkItemTrackingInterfaces.FieldsToEvaluate} ruleEngineInput
	    */
	    evaluateRulesOnField(ruleEngineInput: WorkItemTrackingInterfaces.FieldsToEvaluate): Q.Promise<void>;
	    /**
	    * Returns a single update for a work item
	    *
	    * @param {number} id
	    * @param {number} updateNumber
	    */
	    getUpdate(id: number, updateNumber: number): Q.Promise<WorkItemTrackingInterfaces.WorkItemUpdate>;
	    /**
	    * Returns a the deltas between work item revisions
	    *
	    * @param {number} id
	    * @param {number} top
	    * @param {number} skip
	    */
	    getUpdates(id: number, top?: number, skip?: number): Q.Promise<WorkItemTrackingInterfaces.WorkItemUpdate[]>;
	    /**
	    * Gets the results of the query.
	    *
	    * @param {WorkItemTrackingInterfaces.Wiql} wiql - The query containing the wiql.
	    * @param {TfsCoreInterfaces.TeamContext} teamContext - The team context for the operation
	    * @param {boolean} timePrecision
	    */
	    queryByWiql(wiql: WorkItemTrackingInterfaces.Wiql, teamContext?: TfsCoreInterfaces.TeamContext, timePrecision?: boolean): Q.Promise<WorkItemTrackingInterfaces.WorkItemQueryResult>;
	    /**
	    * Gets the results of the query by id.
	    *
	    * @param {string} id - The query id.
	    * @param {TfsCoreInterfaces.TeamContext} teamContext - The team context for the operation
	    * @param {boolean} timePrecision
	    */
	    queryById(id: string, teamContext?: TfsCoreInterfaces.TeamContext, timePrecision?: boolean): Q.Promise<WorkItemTrackingInterfaces.WorkItemQueryResult>;
	    /**
	    * Get a batch of work item links
	    *
	    * @param {string} project - Project ID or project name
	    * @param {string[]} types - A list of types to filter the results to specific work item types. Omit this parameter to get work item links of all work item types.
	    * @param {string} continuationToken - Specifies the continuationToken to start the batch from. Omit this parameter to get the first batch of links.
	    * @param {Date} startDateTime - Date/time to use as a starting point for link changes. Only link changes that occurred after that date/time will be returned. Cannot be used in conjunction with 'watermark' parameter.
	    */
	    getReportingLinks(project?: string, types?: string[], continuationToken?: string, startDateTime?: Date): Q.Promise<WorkItemTrackingInterfaces.ReportingWorkItemLinksBatch>;
	    /**
	    * Gets the work item relation types.
	    *
	    * @param {string} relation
	    */
	    getRelationType(relation: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemRelationType>;
	    /**
	    */
	    getRelationTypes(): Q.Promise<WorkItemTrackingInterfaces.WorkItemRelationType[]>;
	    /**
	    * Get a batch of work item revisions with the option of including deleted items
	    *
	    * @param {string} project - Project ID or project name
	    * @param {string[]} fields - A list of fields to return in work item revisions. Omit this parameter to get all reportable fields.
	    * @param {string[]} types - A list of types to filter the results to specific work item types. Omit this parameter to get work item revisions of all work item types.
	    * @param {string} continuationToken - Specifies the watermark to start the batch from. Omit this parameter to get the first batch of revisions.
	    * @param {Date} startDateTime - Date/time to use as a starting point for revisions, all revisions will occur after this date/time. Cannot be used in conjunction with 'watermark' parameter.
	    * @param {boolean} includeIdentityRef - Return an identity reference instead of a string value for identity fields.
	    * @param {boolean} includeDeleted - Specify if the deleted item should be returned.
	    * @param {boolean} includeTagRef - Specify if the tag objects should be returned for System.Tags field.
	    */
	    readReportingRevisionsGet(project?: string, fields?: string[], types?: string[], continuationToken?: string, startDateTime?: Date, includeIdentityRef?: boolean, includeDeleted?: boolean, includeTagRef?: boolean): Q.Promise<WorkItemTrackingInterfaces.ReportingWorkItemRevisionsBatch>;
	    /**
	    * Get a batch of work item revisions
	    *
	    * @param {WorkItemTrackingInterfaces.ReportingWorkItemRevisionsFilter} filter - An object that contains request settings: field filter, type filter, identity format
	    * @param {string} project - Project ID or project name
	    * @param {string} continuationToken - Specifies the watermark to start the batch from. Omit this parameter to get the first batch of revisions.
	    * @param {Date} startDateTime - Date/time to use as a starting point for revisions, all revisions will occur after this date/time. Cannot be used in conjunction with 'watermark' parameter.
	    */
	    readReportingRevisionsPost(filter: WorkItemTrackingInterfaces.ReportingWorkItemRevisionsFilter, project?: string, continuationToken?: string, startDateTime?: Date): Q.Promise<WorkItemTrackingInterfaces.ReportingWorkItemRevisionsBatch>;
	    /**
	    * @param {number} id
	    * @param {boolean} destroy
	    */
	    deleteWorkItem(id: number, destroy?: boolean): Q.Promise<WorkItemTrackingInterfaces.WorkItemDelete>;
	    /**
	    * Returns a single work item
	    *
	    * @param {number} id
	    * @param {string[]} fields
	    * @param {Date} asOf
	    * @param {WorkItemTrackingInterfaces.WorkItemExpand} expand
	    */
	    getWorkItem(id: number, fields?: string[], asOf?: Date, expand?: WorkItemTrackingInterfaces.WorkItemExpand): Q.Promise<WorkItemTrackingInterfaces.WorkItem>;
	    /**
	    * Returns a list of work items
	    *
	    * @param {number[]} ids
	    * @param {string[]} fields
	    * @param {Date} asOf
	    * @param {WorkItemTrackingInterfaces.WorkItemExpand} expand
	    */
	    getWorkItems(ids: number[], fields?: string[], asOf?: Date, expand?: WorkItemTrackingInterfaces.WorkItemExpand): Q.Promise<WorkItemTrackingInterfaces.WorkItem[]>;
	    /**
	    * @param {VSSInterfaces.JsonPatchDocument} document
	    * @param {number} id
	    * @param {boolean} validateOnly
	    * @param {boolean} bypassRules
	    */
	    updateWorkItem(customHeaders: any, document: VSSInterfaces.JsonPatchDocument, id: number, validateOnly?: boolean, bypassRules?: boolean): Q.Promise<WorkItemTrackingInterfaces.WorkItem>;
	    /**
	    * @param {VSSInterfaces.JsonPatchDocument} document
	    * @param {string} project - Project ID or project name
	    * @param {string} type
	    * @param {boolean} validateOnly
	    * @param {boolean} bypassRules
	    */
	    createWorkItem(customHeaders: any, document: VSSInterfaces.JsonPatchDocument, project: string, type: string, validateOnly?: boolean, bypassRules?: boolean): Q.Promise<WorkItemTrackingInterfaces.WorkItem>;
	    /**
	    * Returns a single work item from a template
	    *
	    * @param {string} project - Project ID or project name
	    * @param {string} type
	    * @param {string} fields
	    * @param {Date} asOf
	    * @param {WorkItemTrackingInterfaces.WorkItemExpand} expand
	    */
	    getWorkItemTemplate(project: string, type: string, fields?: string, asOf?: Date, expand?: WorkItemTrackingInterfaces.WorkItemExpand): Q.Promise<WorkItemTrackingInterfaces.WorkItem>;
	    /**
	    * @param {string} project - Project ID or project name
	    */
	    getWorkItemTypeCategories(project: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemTypeCategory[]>;
	    /**
	    * Returns a the deltas between work item revisions
	    *
	    * @param {string} project - Project ID or project name
	    * @param {string} category
	    */
	    getWorkItemTypeCategory(project: string, category: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemTypeCategory>;
	    /**
	    * Returns a the deltas between work item revisions
	    *
	    * @param {string} project - Project ID or project name
	    * @param {string} type
	    */
	    getWorkItemType(project: string, type: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemType>;
	    /**
	    * @param {string} project - Project ID or project name
	    */
	    getWorkItemTypes(project: string): Q.Promise<WorkItemTrackingInterfaces.WorkItemType[]>;
	    /**
	    * Returns the dependent fields for the corresponding workitem type and fieldname
	    *
	    * @param {string} project - Project ID or project name
	    * @param {string} type
	    * @param {string} field
	    */
	    getDependentFields(project: string, type: string, field: string): Q.Promise<WorkItemTrackingInterfaces.FieldDependentRule>;
	    /**
	    * Export work item type
	    *
	    * @param {string} project - Project ID or project name
	    * @param {string} type
	    * @param {boolean} exportGlobalLists
	    */
	    exportWorkItemTypeDefinition(project?: string, type?: string, exportGlobalLists?: boolean): Q.Promise<WorkItemTrackingInterfaces.WorkItemTypeTemplate>;
	    /**
	    * Add/updates a work item type
	    *
	    * @param {WorkItemTrackingInterfaces.WorkItemTypeTemplateUpdateModel} updateModel
	    * @param {string} project - Project ID or project name
	    */
	    updateWorkItemTypeDefinition(updateModel: WorkItemTrackingInterfaces.WorkItemTypeTemplateUpdateModel, project?: string): Q.Promise<WorkItemTrackingInterfaces.ProvisioningResult>;
	}

}
declare module 'vso-node-api/interfaces/ReleaseInterfaces' {
	import FormInputInterfaces = require('vso-node-api/interfaces/common/FormInputInterfaces');
	import VSSInterfaces = require('vso-node-api/interfaces/common/VSSInterfaces');
	export interface AgentArtifactDefinition {
	    alias: string;
	    artifactType: AgentArtifactType;
	    details: string;
	    name: string;
	    version: string;
	}
	export enum AgentArtifactType {
	    XamlBuild = 0,
	    Build = 1,
	    Jenkins = 2,
	    FileShare = 3,
	    Nuget = 4,
	    TfsOnPrem = 5,
	    GitHub = 6,
	    TFGit = 7,
	    ExternalTfsBuild = 8,
	}
	export interface ApprovalOptions {
	    releaseCreatorCanBeApprover: boolean;
	    requiredApproverCount: number;
	}
	export interface ApprovalPendingEvent {
	}
	export enum ApprovalStatus {
	    Undefined = 0,
	    Pending = 1,
	    Approved = 2,
	    Rejected = 4,
	    Reassigned = 6,
	    Canceled = 7,
	    Skipped = 8,
	}
	export enum ApprovalType {
	    Undefined = 0,
	    PreDeploy = 1,
	    PostDeploy = 2,
	}
	export interface Artifact {
	    alias: string;
	    definitionReference: {
	        [key: string]: ArtifactSourceReference;
	    };
	    id: number;
	    isPrimary: boolean;
	    type: string;
	}
	export interface ArtifactInstanceData {
	    accountName: string;
	    authenticationToken: string;
	    tfsUrl: string;
	    version: string;
	}
	export interface ArtifactMetadata {
	    alias: string;
	    instanceReference: BuildVersion;
	}
	export interface ArtifactProvider {
	    id: number;
	    name: string;
	    sourceUri: string;
	    version: string;
	}
	export interface ArtifactSourceId {
	    artifactTypeId: string;
	    sourceIdInputs: SourceIdInput[];
	}
	export interface ArtifactSourceIdsQueryResult {
	    artifactSourceIds: ArtifactSourceId[];
	}
	export interface ArtifactSourceReference {
	    id: string;
	    name: string;
	}
	export interface ArtifactTypeDefinition {
	    inputDescriptors: FormInputInterfaces.InputDescriptor[];
	    name: string;
	}
	export interface ArtifactVersion {
	    artifactSourceId: number;
	    errorMessage: string;
	    versions: BuildVersion[];
	}
	export interface ArtifactVersionQueryResult {
	    artifactVersions: ArtifactVersion[];
	}
	export enum AuditAction {
	    Add = 1,
	    Update = 2,
	    Delete = 3,
	}
	export interface BuildVersion {
	    id: string;
	    name: string;
	    sourceBranch: string;
	}
	/**
	 * Represents a change associated with a build.
	 */
	export interface Change {
	    /**
	     * The author of the change.
	     */
	    author: VSSInterfaces.IdentityRef;
	    /**
	     * The type of change. "commit", "changeset", etc.
	     */
	    changeType: string;
	    /**
	     * The location of a user-friendly representation of the resource.
	     */
	    displayUri: string;
	    /**
	     * Something that identifies the change. For a commit, this would be the SHA1. For a TFVC changeset, this would be the changeset id.
	     */
	    id: string;
	    /**
	     * The location of the full representation of the resource.
	     */
	    location: string;
	    /**
	     * A description of the change. This might be a commit message or changeset description.
	     */
	    message: string;
	    /**
	     * A timestamp for the change.
	     */
	    timestamp: Date;
	}
	export interface Condition {
	    conditionType: ConditionType;
	    name: string;
	    value: string;
	}
	export enum ConditionType {
	    Undefined = 0,
	    Event = 1,
	    EnvironmentState = 2,
	}
	export interface ConfigurationVariableValue {
	    isSecret: boolean;
	    value: string;
	}
	export interface Consumer {
	    consumerId: number;
	    consumerName: string;
	}
	export interface DeploymentAttempt {
	    attempt: number;
	    /**
	     * Error log to show any unexpected error that occurred during executing deploy step
	     */
	    errorLog: string;
	    id: number;
	    job: ReleaseTask;
	    runPlanId: string;
	    tasks: ReleaseTask[];
	}
	/**
	 * Defines policy on environment queuing at Release Management side queue. We will send to Environment Runner [creating pre-deploy and other steps] only when the policies mentioned are satisfied.
	 */
	export interface EnvironmentExecutionPolicy {
	    /**
	     * This policy decides, how many environments would be with Environment Runner.
	     */
	    concurrencyCount: number;
	    /**
	     * Queue depth in the EnvironmentQueue table, this table keeps the environment entries till Environment Runner is free [as per it's policy] to take another environment for running.
	     */
	    queueDepthCount: number;
	}
	export enum EnvironmentStatus {
	    Undefined = 0,
	    NotStarted = 1,
	    Pending = 2,
	    Succeeded = 3,
	    Rejected = 4,
	    InProgress = 5,
	    Canceled = 6,
	    Queued = 7,
	}
	export interface Issue {
	    issueType: string;
	    message: string;
	}
	export interface RealtimeReleaseEvent {
	    projectId: string;
	    releaseId: number;
	}
	export interface Release {
	    artifacts: Artifact[];
	    createdBy: VSSInterfaces.IdentityRef;
	    createdOn: Date;
	    description: string;
	    environments: ReleaseEnvironment[];
	    id: number;
	    keepForever: boolean;
	    modifiedBy: VSSInterfaces.IdentityRef;
	    modifiedOn: Date;
	    name: string;
	    poolName: string;
	    reason: ReleaseReason;
	    releaseDefinition: ShallowReference;
	    releaseNameFormat: string;
	    status: ReleaseStatus;
	    variables: {
	        [key: string]: ConfigurationVariableValue;
	    };
	}
	export interface ReleaseApproval {
	    approvalType: ApprovalType;
	    approvedBy: VSSInterfaces.IdentityRef;
	    approver: VSSInterfaces.IdentityRef;
	    attempt: number;
	    comments: string;
	    createdOn: Date;
	    history: ReleaseApprovalHistory[];
	    id: number;
	    isAutomated: boolean;
	    isNotificationOn: boolean;
	    modifiedOn: Date;
	    rank: number;
	    release: ShallowReference;
	    releaseDefinition: ShallowReference;
	    releaseEnvironment: ShallowReference;
	    revision: number;
	    status: ApprovalStatus;
	    trialNumber: number;
	}
	export interface ReleaseApprovalHistory {
	    approver: VSSInterfaces.IdentityRef;
	    changedBy: VSSInterfaces.IdentityRef;
	    comments: string;
	    createdOn: Date;
	    modifiedOn: Date;
	    revision: number;
	}
	export interface ReleaseArtifact {
	    artifactProvider: ArtifactProvider;
	    artifactType: string;
	    definitionData: string;
	    definitionId: number;
	    description: string;
	    id: number;
	    name: string;
	    releaseId: number;
	}
	export interface ReleaseDefinition {
	    artifacts: Artifact[];
	    createdBy: VSSInterfaces.IdentityRef;
	    createdOn: Date;
	    environments: ReleaseDefinitionEnvironment[];
	    id: number;
	    modifiedBy: VSSInterfaces.IdentityRef;
	    modifiedOn: Date;
	    name: string;
	    releaseNameFormat: string;
	    retentionPolicy: RetentionPolicy;
	    revision: number;
	    triggers: ReleaseTrigger[];
	    variables: {
	        [key: string]: ConfigurationVariableValue;
	    };
	}
	export interface ReleaseDefinitionApprovals {
	    approvalOptions: ApprovalOptions;
	    approvals: ReleaseDefinitionApprovalStep[];
	}
	export interface ReleaseDefinitionApprovalStep extends ReleaseDefinitionEnvironmentStep {
	    approver: VSSInterfaces.IdentityRef;
	    isAutomated: boolean;
	    isNotificationOn: boolean;
	    rank: number;
	}
	export interface ReleaseDefinitionDeployStep extends ReleaseDefinitionEnvironmentStep {
	    /**
	     * The list of steps for this definition.
	     */
	    tasks: WorkflowTask[];
	}
	export interface ReleaseDefinitionEnvironment {
	    conditions: Condition[];
	    demands: any[];
	    deployStep: ReleaseDefinitionDeployStep;
	    executionPolicy: EnvironmentExecutionPolicy;
	    id: number;
	    name: string;
	    owner: VSSInterfaces.IdentityRef;
	    postDeployApprovals: ReleaseDefinitionApprovals;
	    preDeployApprovals: ReleaseDefinitionApprovals;
	    queueId: number;
	    rank: number;
	    runOptions: {
	        [key: string]: string;
	    };
	    variables: {
	        [key: string]: ConfigurationVariableValue;
	    };
	}
	export interface ReleaseDefinitionEnvironmentStep {
	    id: number;
	}
	export interface ReleaseDefinitionEnvironmentSummary {
	    id: number;
	    lastReleases: ShallowReference[];
	    name: string;
	}
	export interface ReleaseDefinitionEnvironmentTemplate {
	    canDelete: boolean;
	    category: string;
	    description: string;
	    environment: ReleaseDefinitionEnvironment;
	    iconTaskId: string;
	    id: string;
	    name: string;
	}
	export enum ReleaseDefinitionExpands {
	    None = 0,
	    Environments = 2,
	    Artifacts = 4,
	}
	export interface ReleaseDefinitionRevision {
	    changedBy: VSSInterfaces.IdentityRef;
	    changedDate: Date;
	    changeType: AuditAction;
	    definitionId: number;
	    definitionUrl: string;
	    revision: number;
	}
	export interface ReleaseDefinitionSummary {
	    environments: ReleaseDefinitionEnvironmentSummary[];
	    releaseDefinition: ShallowReference;
	    releases: Release[];
	}
	export interface ReleaseEnvironment {
	    conditions: Condition[];
	    createdOn: Date;
	    definitionEnvironmentId: number;
	    demands: any[];
	    deploySteps: DeploymentAttempt[];
	    id: number;
	    modifiedOn: Date;
	    name: string;
	    owner: VSSInterfaces.IdentityRef;
	    postApprovalsSnapshot: ReleaseDefinitionApprovals;
	    postDeployApprovals: ReleaseApproval[];
	    preApprovalsSnapshot: ReleaseDefinitionApprovals;
	    preDeployApprovals: ReleaseApproval[];
	    queueId: number;
	    rank: number;
	    releaseId: number;
	    runOptions: {
	        [key: string]: string;
	    };
	    scheduledDeploymentTime: Date;
	    status: EnvironmentStatus;
	    variables: {
	        [key: string]: ConfigurationVariableValue;
	    };
	    workflowTasks: WorkflowTask[];
	}
	export interface ReleaseEnvironmentCompletedEvent {
	    createdByName: string;
	    definitionName: string;
	    environment: ReleaseEnvironment;
	    projectName: string;
	    releaseCreatedBy: VSSInterfaces.IdentityRef;
	    releaseLogsUri: string;
	    releaseName: string;
	    status: string;
	    title: string;
	    webAccessUri: string;
	}
	export enum ReleaseExpands {
	    None = 0,
	    Environments = 2,
	    Artifacts = 4,
	    Approvals = 8,
	}
	export enum ReleaseQueryOrder {
	    Descending = 0,
	    Ascending = 1,
	}
	export enum ReleaseReason {
	    None = 0,
	    Manual = 1,
	    ContinuousIntegration = 2,
	    Schedule = 3,
	}
	export interface ReleaseSchedule {
	    /**
	     * Days of the week to release
	     */
	    daysToRelease: ScheduleDays;
	    /**
	     * Team Foundation Job Definition Job Id
	     */
	    jobId: string;
	    /**
	     * Local time zone hour to start
	     */
	    startHours: number;
	    /**
	     * Local time zone minute to start
	     */
	    startMinutes: number;
	    /**
	     * Time zone Id of release schedule, such as 'UTC'
	     */
	    timeZoneId: string;
	}
	export interface ReleaseStartMetadata {
	    artifacts: ArtifactMetadata[];
	    definitionId: number;
	    description: string;
	    isDraft: boolean;
	    reason: ReleaseReason;
	}
	export enum ReleaseStatus {
	    Undefined = 0,
	    Draft = 1,
	    Abandoned = 2,
	    Active = 3,
	}
	export interface ReleaseTask {
	    agentName: string;
	    dateEnded: Date;
	    dateStarted: Date;
	    id: number;
	    issues: Issue[];
	    lineCount: number;
	    name: string;
	    rank: number;
	    status: TaskStatus;
	    timelineRecordId: string;
	}
	export interface ReleaseTaskLogUpdatedEvent extends RealtimeReleaseEvent {
	    environmentId: number;
	    lines: string[];
	    timelineRecordId: string;
	}
	export interface ReleaseTasksUpdatedEvent extends RealtimeReleaseEvent {
	    environmentId: number;
	    job: ReleaseTask;
	    releaseStepId: number;
	    tasks: ReleaseTask[];
	}
	export interface ReleaseTrigger {
	    /**
	     * Artifact source alias for ArtifactSource trigger type - value is null for all other trigger types
	     */
	    artifactAlias: string;
	    /**
	     * Release schedule for Schedule trigger type - value is null for all other trigger types
	     */
	    schedule: ReleaseSchedule;
	    triggerType: ReleaseTriggerType;
	}
	export enum ReleaseTriggerType {
	    Undefined = 0,
	    ArtifactSource = 1,
	    Schedule = 2,
	}
	export interface ReleaseUpdatedEvent extends RealtimeReleaseEvent {
	    release: Release;
	}
	export interface ReleaseUpdateMetadata {
	    keepForever: boolean;
	    status: ReleaseStatus;
	}
	export interface ReleaseWorkItemRef {
	    id: string;
	    url: string;
	}
	export interface RetentionPolicy {
	    daysToKeep: number;
	}
	export enum ScheduleDays {
	    None = 0,
	    Monday = 1,
	    Tuesday = 2,
	    Wednesday = 4,
	    Thursday = 8,
	    Friday = 16,
	    Saturday = 32,
	    Sunday = 64,
	    All = 127,
	}
	export interface ShallowReference {
	    id: number;
	    name: string;
	    url: string;
	}
	export interface SourceIdInput {
	    id: string;
	    name: string;
	}
	export enum TaskStatus {
	    Unknown = 0,
	    Pending = 1,
	    InProgress = 2,
	    Success = 3,
	    Failure = 4,
	    Canceled = 5,
	    Skipped = 6,
	}
	export interface TimeZone {
	    displayName: string;
	    id: string;
	}
	export interface TimeZoneList {
	    utcTimeZone: TimeZone;
	    validTimeZones: TimeZone[];
	}
	export interface WorkflowTask {
	    alwaysRun: boolean;
	    continueOnError: boolean;
	    enabled: boolean;
	    inputs: {
	        [key: string]: string;
	    };
	    name: string;
	    taskId: string;
	    version: string;
	}
	export var TypeInfo: {
	    AgentArtifactDefinition: {
	        fields: any;
	    };
	    AgentArtifactType: {
	        enumValues: {
	            "xamlBuild": number;
	            "build": number;
	            "jenkins": number;
	            "fileShare": number;
	            "nuget": number;
	            "tfsOnPrem": number;
	            "gitHub": number;
	            "tFGit": number;
	            "externalTfsBuild": number;
	        };
	    };
	    ApprovalOptions: {
	        fields: any;
	    };
	    ApprovalPendingEvent: {
	        fields: any;
	    };
	    ApprovalStatus: {
	        enumValues: {
	            "undefined": number;
	            "pending": number;
	            "approved": number;
	            "rejected": number;
	            "reassigned": number;
	            "canceled": number;
	            "skipped": number;
	        };
	    };
	    ApprovalType: {
	        enumValues: {
	            "undefined": number;
	            "preDeploy": number;
	            "postDeploy": number;
	        };
	    };
	    Artifact: {
	        fields: any;
	    };
	    ArtifactInstanceData: {
	        fields: any;
	    };
	    ArtifactMetadata: {
	        fields: any;
	    };
	    ArtifactProvider: {
	        fields: any;
	    };
	    ArtifactSourceId: {
	        fields: any;
	    };
	    ArtifactSourceIdsQueryResult: {
	        fields: any;
	    };
	    ArtifactSourceReference: {
	        fields: any;
	    };
	    ArtifactTypeDefinition: {
	        fields: any;
	    };
	    ArtifactVersion: {
	        fields: any;
	    };
	    ArtifactVersionQueryResult: {
	        fields: any;
	    };
	    AuditAction: {
	        enumValues: {
	            "add": number;
	            "update": number;
	            "delete": number;
	        };
	    };
	    BuildVersion: {
	        fields: any;
	    };
	    Change: {
	        fields: any;
	    };
	    Condition: {
	        fields: any;
	    };
	    ConditionType: {
	        enumValues: {
	            "undefined": number;
	            "event": number;
	            "environmentState": number;
	        };
	    };
	    ConfigurationVariableValue: {
	        fields: any;
	    };
	    Consumer: {
	        fields: any;
	    };
	    DeploymentAttempt: {
	        fields: any;
	    };
	    EnvironmentExecutionPolicy: {
	        fields: any;
	    };
	    EnvironmentStatus: {
	        enumValues: {
	            "undefined": number;
	            "notStarted": number;
	            "pending": number;
	            "succeeded": number;
	            "rejected": number;
	            "inProgress": number;
	            "canceled": number;
	            "queued": number;
	        };
	    };
	    Issue: {
	        fields: any;
	    };
	    RealtimeReleaseEvent: {
	        fields: any;
	    };
	    Release: {
	        fields: any;
	    };
	    ReleaseApproval: {
	        fields: any;
	    };
	    ReleaseApprovalHistory: {
	        fields: any;
	    };
	    ReleaseArtifact: {
	        fields: any;
	    };
	    ReleaseDefinition: {
	        fields: any;
	    };
	    ReleaseDefinitionApprovals: {
	        fields: any;
	    };
	    ReleaseDefinitionApprovalStep: {
	        fields: any;
	    };
	    ReleaseDefinitionDeployStep: {
	        fields: any;
	    };
	    ReleaseDefinitionEnvironment: {
	        fields: any;
	    };
	    ReleaseDefinitionEnvironmentStep: {
	        fields: any;
	    };
	    ReleaseDefinitionEnvironmentSummary: {
	        fields: any;
	    };
	    ReleaseDefinitionEnvironmentTemplate: {
	        fields: any;
	    };
	    ReleaseDefinitionExpands: {
	        enumValues: {
	            "none": number;
	            "environments": number;
	            "artifacts": number;
	        };
	    };
	    ReleaseDefinitionRevision: {
	        fields: any;
	    };
	    ReleaseDefinitionSummary: {
	        fields: any;
	    };
	    ReleaseEnvironment: {
	        fields: any;
	    };
	    ReleaseEnvironmentCompletedEvent: {
	        fields: any;
	    };
	    ReleaseExpands: {
	        enumValues: {
	            "none": number;
	            "environments": number;
	            "artifacts": number;
	            "approvals": number;
	        };
	    };
	    ReleaseQueryOrder: {
	        enumValues: {
	            "descending": number;
	            "ascending": number;
	        };
	    };
	    ReleaseReason: {
	        enumValues: {
	            "none": number;
	            "manual": number;
	            "continuousIntegration": number;
	            "schedule": number;
	        };
	    };
	    ReleaseSchedule: {
	        fields: any;
	    };
	    ReleaseStartMetadata: {
	        fields: any;
	    };
	    ReleaseStatus: {
	        enumValues: {
	            "undefined": number;
	            "draft": number;
	            "abandoned": number;
	            "active": number;
	        };
	    };
	    ReleaseTask: {
	        fields: any;
	    };
	    ReleaseTaskLogUpdatedEvent: {
	        fields: any;
	    };
	    ReleaseTasksUpdatedEvent: {
	        fields: any;
	    };
	    ReleaseTrigger: {
	        fields: any;
	    };
	    ReleaseTriggerType: {
	        enumValues: {
	            "undefined": number;
	            "artifactSource": number;
	            "schedule": number;
	        };
	    };
	    ReleaseUpdatedEvent: {
	        fields: any;
	    };
	    ReleaseUpdateMetadata: {
	        fields: any;
	    };
	    ReleaseWorkItemRef: {
	        fields: any;
	    };
	    RetentionPolicy: {
	        fields: any;
	    };
	    ScheduleDays: {
	        enumValues: {
	            "none": number;
	            "monday": number;
	            "tuesday": number;
	            "wednesday": number;
	            "thursday": number;
	            "friday": number;
	            "saturday": number;
	            "sunday": number;
	            "all": number;
	        };
	    };
	    ShallowReference: {
	        fields: any;
	    };
	    SourceIdInput: {
	        fields: any;
	    };
	    TaskStatus: {
	        enumValues: {
	            "unknown": number;
	            "pending": number;
	            "inProgress": number;
	            "success": number;
	            "failure": number;
	            "canceled": number;
	            "skipped": number;
	        };
	    };
	    TimeZone: {
	        fields: any;
	    };
	    TimeZoneList: {
	        fields: any;
	    };
	    WorkflowTask: {
	        fields: any;
	    };
	};

}
declare module 'vso-node-api/ReleaseApi' {
	/// <reference path="../node/node.d.ts" />
	/// <reference path="../q/Q.d.ts" />
	import Q = require('q');
	import basem = require('vso-node-api/ClientApiBases');
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	import FormInputInterfaces = require('vso-node-api/interfaces/common/FormInputInterfaces');
	import ReleaseInterfaces = require('vso-node-api/interfaces/ReleaseInterfaces');
	export interface IReleaseApi extends basem.ClientApiBase {
	    getAgentArtifactDefinitions(project: string, releaseId: number, onResult: (err: any, statusCode: number, agentartifacts: ReleaseInterfaces.AgentArtifactDefinition[]) => void): void;
	    getApprovals(project: string, assignedToFilter: string, statusFilter: ReleaseInterfaces.ApprovalStatus, releaseIdsFilter: number[], onResult: (err: any, statusCode: number, approvals: ReleaseInterfaces.ReleaseApproval[]) => void): void;
	    getApprovalHistory(project: string, approvalStepId: number, onResult: (err: any, statusCode: number, approval: ReleaseInterfaces.ReleaseApproval) => void): void;
	    updateReleaseApproval(approval: ReleaseInterfaces.ReleaseApproval, project: string, approvalId: number, onResult: (err: any, statusCode: number, approval: ReleaseInterfaces.ReleaseApproval) => void): void;
	    getReleaseChanges(project: string, releaseId: number, baseReleaseId: number, top: number, onResult: (err: any, statusCode: number, changes: ReleaseInterfaces.Change[]) => void): void;
	    createReleaseDefinition(releaseDefinition: ReleaseInterfaces.ReleaseDefinition, project: string, onResult: (err: any, statusCode: number, definition: ReleaseInterfaces.ReleaseDefinition) => void): void;
	    deleteReleaseDefinition(project: string, definitionId: number, onResult: (err: any, statusCode: number) => void): void;
	    getReleaseDefinition(project: string, definitionId: number, onResult: (err: any, statusCode: number, definition: ReleaseInterfaces.ReleaseDefinition) => void): void;
	    getReleaseDefinitions(project: string, searchText: string, artifactIdFilter: number, expand: ReleaseInterfaces.ReleaseDefinitionExpands, onResult: (err: any, statusCode: number, definitions: ReleaseInterfaces.ReleaseDefinition[]) => void): void;
	    getReleaseDefinitionsForArtifactSource(project: string, artifactType: string, artifactSourceId: string, expand: ReleaseInterfaces.ReleaseDefinitionExpands, onResult: (err: any, statusCode: number, definitions: ReleaseInterfaces.ReleaseDefinition[]) => void): void;
	    updateReleaseDefinition(releaseDefinition: ReleaseInterfaces.ReleaseDefinition, project: string, onResult: (err: any, statusCode: number, definition: ReleaseInterfaces.ReleaseDefinition) => void): void;
	    getReleaseEnvironment(project: string, releaseId: number, environmentId: number, onResult: (err: any, statusCode: number, environment: ReleaseInterfaces.ReleaseEnvironment) => void): void;
	    updateReleaseEnvironment(environmentUpdateData: any, project: string, releaseId: number, environmentId: number, onResult: (err: any, statusCode: number, environment: ReleaseInterfaces.ReleaseEnvironment) => void): void;
	    createDefinitionEnvironmentTemplate(template: ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate, project: string, onResult: (err: any, statusCode: number, environmenttemplate: ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate) => void): void;
	    deleteDefinitionEnvironmentTemplate(project: string, templateId: string, onResult: (err: any, statusCode: number) => void): void;
	    getDefinitionEnvironmentTemplate(project: string, templateId: string, onResult: (err: any, statusCode: number, environmenttemplate: ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate) => void): void;
	    listDefinitionEnvironmentTemplates(project: string, onResult: (err: any, statusCode: number, environmenttemplates: ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate[]) => void): void;
	    getInputValues(query: FormInputInterfaces.InputValuesQuery, project: string, onResult: (err: any, statusCode: number, inputvaluesquery: FormInputInterfaces.InputValuesQuery) => void): void;
	    getLogs(project: string, releaseId: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getLog(project: string, releaseId: number, environmentId: number, taskId: number, attemptId: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    createRelease(releaseStartMetadata: ReleaseInterfaces.ReleaseStartMetadata, project: string, onResult: (err: any, statusCode: number, release: ReleaseInterfaces.Release) => void): void;
	    deleteRelease(project: string, releaseId: number, onResult: (err: any, statusCode: number) => void): void;
	    getRelease(project: string, releaseId: number, includeAllApprovals: boolean, onResult: (err: any, statusCode: number, release: ReleaseInterfaces.Release) => void): void;
	    getReleaseDefinitionSummary(project: string, definitionId: number, releaseCount: number, includeArtifact: boolean, onResult: (err: any, statusCode: number, release: ReleaseInterfaces.ReleaseDefinitionSummary) => void): void;
	    getReleases(project: string, definitionId: number, definitionEnvironmentId: number, searchText: string, createdBy: string, statusFilter: ReleaseInterfaces.ReleaseStatus, minCreatedTime: Date, maxCreatedTime: Date, queryOrder: ReleaseInterfaces.ReleaseQueryOrder, top: number, continuationToken: number, expand: ReleaseInterfaces.ReleaseExpands, artifactTypeId: string, artifactSourceId: number, artifactVersionId: string, onResult: (err: any, statusCode: number, releases: ReleaseInterfaces.Release[]) => void): void;
	    updateRelease(release: ReleaseInterfaces.Release, project: string, releaseId: number, onResult: (err: any, statusCode: number, release: ReleaseInterfaces.Release) => void): void;
	    updateReleaseResource(releaseUpdateMetadata: ReleaseInterfaces.ReleaseUpdateMetadata, project: string, releaseId: number, onResult: (err: any, statusCode: number, release: ReleaseInterfaces.Release) => void): void;
	    getReleaseDefinitionHistory(project: string, definitionId: number, onResult: (err: any, statusCode: number, revisions: ReleaseInterfaces.ReleaseDefinitionRevision[]) => void): void;
	    getReleaseDefinitionRevision(project: string, definitionId: number, revision: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    getArtifactsSources(project: string, typeId: string, onResult: (err: any, statusCode: number, source: ReleaseInterfaces.ArtifactSourceIdsQueryResult) => void): void;
	    getTasks(project: string, releaseId: number, environmentId: number, attemptId: number, onResult: (err: any, statusCode: number, tasks: ReleaseInterfaces.ReleaseTask[]) => void): void;
	    getArtifactTypeDefinitions(project: string, onResult: (err: any, statusCode: number, types: ReleaseInterfaces.ArtifactTypeDefinition[]) => void): void;
	    getArtifactVersions(project: string, releaseDefinitionId: number, onResult: (err: any, statusCode: number, version: ReleaseInterfaces.ArtifactVersionQueryResult) => void): void;
	    getArtifactVersionsForSources(artifacts: ReleaseInterfaces.Artifact[], project: string, onResult: (err: any, statusCode: number, version: ReleaseInterfaces.ArtifactVersionQueryResult) => void): void;
	    getReleaseWorkItemsRefs(project: string, releaseId: number, baseReleaseId: number, top: number, onResult: (err: any, statusCode: number, workitems: ReleaseInterfaces.ReleaseWorkItemRef[]) => void): void;
	}
	export interface IQReleaseApi extends basem.QClientApiBase {
	    getAgentArtifactDefinitions(project: string, releaseId: number): Q.Promise<ReleaseInterfaces.AgentArtifactDefinition[]>;
	    getApprovals(project: string, assignedToFilter?: string, statusFilter?: ReleaseInterfaces.ApprovalStatus, releaseIdsFilter?: number[]): Q.Promise<ReleaseInterfaces.ReleaseApproval[]>;
	    getApprovalHistory(project: string, approvalStepId: number): Q.Promise<ReleaseInterfaces.ReleaseApproval>;
	    updateReleaseApproval(approval: ReleaseInterfaces.ReleaseApproval, project: string, approvalId: number): Q.Promise<ReleaseInterfaces.ReleaseApproval>;
	    getReleaseChanges(project: string, releaseId: number, baseReleaseId?: number, top?: number): Q.Promise<ReleaseInterfaces.Change[]>;
	    createReleaseDefinition(releaseDefinition: ReleaseInterfaces.ReleaseDefinition, project: string): Q.Promise<ReleaseInterfaces.ReleaseDefinition>;
	    deleteReleaseDefinition(project: string, definitionId: number): Q.Promise<void>;
	    getReleaseDefinition(project: string, definitionId: number): Q.Promise<ReleaseInterfaces.ReleaseDefinition>;
	    getReleaseDefinitions(project: string, searchText?: string, artifactIdFilter?: number, expand?: ReleaseInterfaces.ReleaseDefinitionExpands): Q.Promise<ReleaseInterfaces.ReleaseDefinition[]>;
	    getReleaseDefinitionsForArtifactSource(project: string, artifactType: string, artifactSourceId: string, expand?: ReleaseInterfaces.ReleaseDefinitionExpands): Q.Promise<ReleaseInterfaces.ReleaseDefinition[]>;
	    updateReleaseDefinition(releaseDefinition: ReleaseInterfaces.ReleaseDefinition, project: string): Q.Promise<ReleaseInterfaces.ReleaseDefinition>;
	    getReleaseEnvironment(project: string, releaseId: number, environmentId: number): Q.Promise<ReleaseInterfaces.ReleaseEnvironment>;
	    updateReleaseEnvironment(environmentUpdateData: any, project: string, releaseId: number, environmentId: number): Q.Promise<ReleaseInterfaces.ReleaseEnvironment>;
	    createDefinitionEnvironmentTemplate(template: ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate, project: string): Q.Promise<ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate>;
	    deleteDefinitionEnvironmentTemplate(project: string, templateId: string): Q.Promise<void>;
	    getDefinitionEnvironmentTemplate(project: string, templateId: string): Q.Promise<ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate>;
	    listDefinitionEnvironmentTemplates(project: string): Q.Promise<ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate[]>;
	    getInputValues(query: FormInputInterfaces.InputValuesQuery, project: string): Q.Promise<FormInputInterfaces.InputValuesQuery>;
	    getLogs(project: string, releaseId: number): Q.Promise<NodeJS.ReadableStream>;
	    getLog(project: string, releaseId: number, environmentId: number, taskId: number, attemptId?: number): Q.Promise<NodeJS.ReadableStream>;
	    createRelease(releaseStartMetadata: ReleaseInterfaces.ReleaseStartMetadata, project: string): Q.Promise<ReleaseInterfaces.Release>;
	    deleteRelease(project: string, releaseId: number): Q.Promise<void>;
	    getRelease(project: string, releaseId: number, includeAllApprovals?: boolean): Q.Promise<ReleaseInterfaces.Release>;
	    getReleaseDefinitionSummary(project: string, definitionId: number, releaseCount: number, includeArtifact?: boolean): Q.Promise<ReleaseInterfaces.ReleaseDefinitionSummary>;
	    getReleases(project: string, definitionId?: number, definitionEnvironmentId?: number, searchText?: string, createdBy?: string, statusFilter?: ReleaseInterfaces.ReleaseStatus, minCreatedTime?: Date, maxCreatedTime?: Date, queryOrder?: ReleaseInterfaces.ReleaseQueryOrder, top?: number, continuationToken?: number, expand?: ReleaseInterfaces.ReleaseExpands, artifactTypeId?: string, artifactSourceId?: number, artifactVersionId?: string): Q.Promise<ReleaseInterfaces.Release[]>;
	    updateRelease(release: ReleaseInterfaces.Release, project: string, releaseId: number): Q.Promise<ReleaseInterfaces.Release>;
	    updateReleaseResource(releaseUpdateMetadata: ReleaseInterfaces.ReleaseUpdateMetadata, project: string, releaseId: number): Q.Promise<ReleaseInterfaces.Release>;
	    getReleaseDefinitionHistory(project: string, definitionId: number): Q.Promise<ReleaseInterfaces.ReleaseDefinitionRevision[]>;
	    getReleaseDefinitionRevision(project: string, definitionId: number, revision: number): Q.Promise<NodeJS.ReadableStream>;
	    getArtifactsSources(project: string, typeId?: string): Q.Promise<ReleaseInterfaces.ArtifactSourceIdsQueryResult>;
	    getTasks(project: string, releaseId: number, environmentId: number, attemptId?: number): Q.Promise<ReleaseInterfaces.ReleaseTask[]>;
	    getArtifactTypeDefinitions(project: string): Q.Promise<ReleaseInterfaces.ArtifactTypeDefinition[]>;
	    getArtifactVersions(project: string, releaseDefinitionId: number): Q.Promise<ReleaseInterfaces.ArtifactVersionQueryResult>;
	    getArtifactVersionsForSources(artifacts: ReleaseInterfaces.Artifact[], project: string): Q.Promise<ReleaseInterfaces.ArtifactVersionQueryResult>;
	    getReleaseWorkItemsRefs(project: string, releaseId: number, baseReleaseId?: number, top?: number): Q.Promise<ReleaseInterfaces.ReleaseWorkItemRef[]>;
	}
	export class ReleaseApi extends basem.ClientApiBase implements IReleaseApi {
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	     * Returns the artifact details that automation agent requires
	     *
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseId
	     * @param onResult callback function with the resulting ReleaseInterfaces.AgentArtifactDefinition[]
	     */
	    getAgentArtifactDefinitions(project: string, releaseId: number, onResult: (err: any, statusCode: number, agentartifacts: ReleaseInterfaces.AgentArtifactDefinition[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {string} assignedToFilter
	     * @param {ReleaseInterfaces.ApprovalStatus} statusFilter
	     * @param {number[]} releaseIdsFilter
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseApproval[]
	     */
	    getApprovals(project: string, assignedToFilter: string, statusFilter: ReleaseInterfaces.ApprovalStatus, releaseIdsFilter: number[], onResult: (err: any, statusCode: number, approvals: ReleaseInterfaces.ReleaseApproval[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} approvalStepId
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseApproval
	     */
	    getApprovalHistory(project: string, approvalStepId: number, onResult: (err: any, statusCode: number, approval: ReleaseInterfaces.ReleaseApproval) => void): void;
	    /**
	     * @param {ReleaseInterfaces.ReleaseApproval} approval
	     * @param {string} project - Project ID or project name
	     * @param {number} approvalId
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseApproval
	     */
	    updateReleaseApproval(approval: ReleaseInterfaces.ReleaseApproval, project: string, approvalId: number, onResult: (err: any, statusCode: number, approval: ReleaseInterfaces.ReleaseApproval) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseId
	     * @param {number} baseReleaseId
	     * @param {number} top
	     * @param onResult callback function with the resulting ReleaseInterfaces.Change[]
	     */
	    getReleaseChanges(project: string, releaseId: number, baseReleaseId: number, top: number, onResult: (err: any, statusCode: number, changes: ReleaseInterfaces.Change[]) => void): void;
	    /**
	     * @param {ReleaseInterfaces.ReleaseDefinition} releaseDefinition
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseDefinition
	     */
	    createReleaseDefinition(releaseDefinition: ReleaseInterfaces.ReleaseDefinition, project: string, onResult: (err: any, statusCode: number, definition: ReleaseInterfaces.ReleaseDefinition) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} definitionId
	     * @param onResult callback function
	     */
	    deleteReleaseDefinition(project: string, definitionId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} definitionId
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseDefinition
	     */
	    getReleaseDefinition(project: string, definitionId: number, onResult: (err: any, statusCode: number, definition: ReleaseInterfaces.ReleaseDefinition) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {string} searchText
	     * @param {number} artifactIdFilter
	     * @param {ReleaseInterfaces.ReleaseDefinitionExpands} expand
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseDefinition[]
	     */
	    getReleaseDefinitions(project: string, searchText: string, artifactIdFilter: number, expand: ReleaseInterfaces.ReleaseDefinitionExpands, onResult: (err: any, statusCode: number, definitions: ReleaseInterfaces.ReleaseDefinition[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {string} artifactType
	     * @param {string} artifactSourceId
	     * @param {ReleaseInterfaces.ReleaseDefinitionExpands} expand
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseDefinition[]
	     */
	    getReleaseDefinitionsForArtifactSource(project: string, artifactType: string, artifactSourceId: string, expand: ReleaseInterfaces.ReleaseDefinitionExpands, onResult: (err: any, statusCode: number, definitions: ReleaseInterfaces.ReleaseDefinition[]) => void): void;
	    /**
	     * @param {ReleaseInterfaces.ReleaseDefinition} releaseDefinition
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseDefinition
	     */
	    updateReleaseDefinition(releaseDefinition: ReleaseInterfaces.ReleaseDefinition, project: string, onResult: (err: any, statusCode: number, definition: ReleaseInterfaces.ReleaseDefinition) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseId
	     * @param {number} environmentId
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseEnvironment
	     */
	    getReleaseEnvironment(project: string, releaseId: number, environmentId: number, onResult: (err: any, statusCode: number, environment: ReleaseInterfaces.ReleaseEnvironment) => void): void;
	    /**
	     * @param {any} environmentUpdateData
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseId
	     * @param {number} environmentId
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseEnvironment
	     */
	    updateReleaseEnvironment(environmentUpdateData: any, project: string, releaseId: number, environmentId: number, onResult: (err: any, statusCode: number, environment: ReleaseInterfaces.ReleaseEnvironment) => void): void;
	    /**
	     * @param {ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate} template
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate
	     */
	    createDefinitionEnvironmentTemplate(template: ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate, project: string, onResult: (err: any, statusCode: number, environmenttemplate: ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {string} templateId
	     * @param onResult callback function
	     */
	    deleteDefinitionEnvironmentTemplate(project: string, templateId: string, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {string} templateId
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate
	     */
	    getDefinitionEnvironmentTemplate(project: string, templateId: string, onResult: (err: any, statusCode: number, environmenttemplate: ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate[]
	     */
	    listDefinitionEnvironmentTemplates(project: string, onResult: (err: any, statusCode: number, environmenttemplates: ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate[]) => void): void;
	    /**
	     * @param {FormInputInterfaces.InputValuesQuery} query
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting FormInputInterfaces.InputValuesQuery
	     */
	    getInputValues(query: FormInputInterfaces.InputValuesQuery, project: string, onResult: (err: any, statusCode: number, inputvaluesquery: FormInputInterfaces.InputValuesQuery) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseId
	     * @param onResult callback function with the resulting ArrayBuffer
	     */
	    getLogs(project: string, releaseId: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseId
	     * @param {number} environmentId
	     * @param {number} taskId
	     * @param {number} attemptId
	     * @param onResult callback function with the resulting string
	     */
	    getLog(project: string, releaseId: number, environmentId: number, taskId: number, attemptId: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {ReleaseInterfaces.ReleaseStartMetadata} releaseStartMetadata
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting ReleaseInterfaces.Release
	     */
	    createRelease(releaseStartMetadata: ReleaseInterfaces.ReleaseStartMetadata, project: string, onResult: (err: any, statusCode: number, release: ReleaseInterfaces.Release) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseId
	     * @param onResult callback function
	     */
	    deleteRelease(project: string, releaseId: number, onResult: (err: any, statusCode: number) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseId
	     * @param {boolean} includeAllApprovals
	     * @param onResult callback function with the resulting ReleaseInterfaces.Release
	     */
	    getRelease(project: string, releaseId: number, includeAllApprovals: boolean, onResult: (err: any, statusCode: number, release: ReleaseInterfaces.Release) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} definitionId
	     * @param {number} releaseCount
	     * @param {boolean} includeArtifact
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseDefinitionSummary
	     */
	    getReleaseDefinitionSummary(project: string, definitionId: number, releaseCount: number, includeArtifact: boolean, onResult: (err: any, statusCode: number, release: ReleaseInterfaces.ReleaseDefinitionSummary) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} definitionId
	     * @param {number} definitionEnvironmentId
	     * @param {string} searchText
	     * @param {string} createdBy
	     * @param {ReleaseInterfaces.ReleaseStatus} statusFilter
	     * @param {Date} minCreatedTime
	     * @param {Date} maxCreatedTime
	     * @param {ReleaseInterfaces.ReleaseQueryOrder} queryOrder
	     * @param {number} top
	     * @param {number} continuationToken
	     * @param {ReleaseInterfaces.ReleaseExpands} expand
	     * @param {string} artifactTypeId
	     * @param {number} artifactSourceId
	     * @param {string} artifactVersionId
	     * @param onResult callback function with the resulting ReleaseInterfaces.Release[]
	     */
	    getReleases(project: string, definitionId: number, definitionEnvironmentId: number, searchText: string, createdBy: string, statusFilter: ReleaseInterfaces.ReleaseStatus, minCreatedTime: Date, maxCreatedTime: Date, queryOrder: ReleaseInterfaces.ReleaseQueryOrder, top: number, continuationToken: number, expand: ReleaseInterfaces.ReleaseExpands, artifactTypeId: string, artifactSourceId: number, artifactVersionId: string, onResult: (err: any, statusCode: number, releases: ReleaseInterfaces.Release[]) => void): void;
	    /**
	     * @param {ReleaseInterfaces.Release} release
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseId
	     * @param onResult callback function with the resulting ReleaseInterfaces.Release
	     */
	    updateRelease(release: ReleaseInterfaces.Release, project: string, releaseId: number, onResult: (err: any, statusCode: number, release: ReleaseInterfaces.Release) => void): void;
	    /**
	     * @param {ReleaseInterfaces.ReleaseUpdateMetadata} releaseUpdateMetadata
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseId
	     * @param onResult callback function with the resulting ReleaseInterfaces.Release
	     */
	    updateReleaseResource(releaseUpdateMetadata: ReleaseInterfaces.ReleaseUpdateMetadata, project: string, releaseId: number, onResult: (err: any, statusCode: number, release: ReleaseInterfaces.Release) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} definitionId
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseDefinitionRevision[]
	     */
	    getReleaseDefinitionHistory(project: string, definitionId: number, onResult: (err: any, statusCode: number, revisions: ReleaseInterfaces.ReleaseDefinitionRevision[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} definitionId
	     * @param {number} revision
	     * @param onResult callback function with the resulting string
	     */
	    getReleaseDefinitionRevision(project: string, definitionId: number, revision: number, onResult: (err: any, statusCode: number, res: NodeJS.ReadableStream) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {string} typeId
	     * @param onResult callback function with the resulting ReleaseInterfaces.ArtifactSourceIdsQueryResult
	     */
	    getArtifactsSources(project: string, typeId: string, onResult: (err: any, statusCode: number, source: ReleaseInterfaces.ArtifactSourceIdsQueryResult) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseId
	     * @param {number} environmentId
	     * @param {number} attemptId
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseTask[]
	     */
	    getTasks(project: string, releaseId: number, environmentId: number, attemptId: number, onResult: (err: any, statusCode: number, tasks: ReleaseInterfaces.ReleaseTask[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting ReleaseInterfaces.ArtifactTypeDefinition[]
	     */
	    getArtifactTypeDefinitions(project: string, onResult: (err: any, statusCode: number, types: ReleaseInterfaces.ArtifactTypeDefinition[]) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseDefinitionId
	     * @param onResult callback function with the resulting ReleaseInterfaces.ArtifactVersionQueryResult
	     */
	    getArtifactVersions(project: string, releaseDefinitionId: number, onResult: (err: any, statusCode: number, version: ReleaseInterfaces.ArtifactVersionQueryResult) => void): void;
	    /**
	     * @param {ReleaseInterfaces.Artifact[]} artifacts
	     * @param {string} project - Project ID or project name
	     * @param onResult callback function with the resulting ReleaseInterfaces.ArtifactVersionQueryResult
	     */
	    getArtifactVersionsForSources(artifacts: ReleaseInterfaces.Artifact[], project: string, onResult: (err: any, statusCode: number, version: ReleaseInterfaces.ArtifactVersionQueryResult) => void): void;
	    /**
	     * @param {string} project - Project ID or project name
	     * @param {number} releaseId
	     * @param {number} baseReleaseId
	     * @param {number} top
	     * @param onResult callback function with the resulting ReleaseInterfaces.ReleaseWorkItemRef[]
	     */
	    getReleaseWorkItemsRefs(project: string, releaseId: number, baseReleaseId: number, top: number, onResult: (err: any, statusCode: number, workitems: ReleaseInterfaces.ReleaseWorkItemRef[]) => void): void;
	}
	export class QReleaseApi extends basem.QClientApiBase implements IQReleaseApi {
	    api: ReleaseApi;
	    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]);
	    /**
	    * Returns the artifact details that automation agent requires
	    *
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseId
	    */
	    getAgentArtifactDefinitions(project: string, releaseId: number): Q.Promise<ReleaseInterfaces.AgentArtifactDefinition[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {string} assignedToFilter
	    * @param {ReleaseInterfaces.ApprovalStatus} statusFilter
	    * @param {number[]} releaseIdsFilter
	    */
	    getApprovals(project: string, assignedToFilter?: string, statusFilter?: ReleaseInterfaces.ApprovalStatus, releaseIdsFilter?: number[]): Q.Promise<ReleaseInterfaces.ReleaseApproval[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} approvalStepId
	    */
	    getApprovalHistory(project: string, approvalStepId: number): Q.Promise<ReleaseInterfaces.ReleaseApproval>;
	    /**
	    * @param {ReleaseInterfaces.ReleaseApproval} approval
	    * @param {string} project - Project ID or project name
	    * @param {number} approvalId
	    */
	    updateReleaseApproval(approval: ReleaseInterfaces.ReleaseApproval, project: string, approvalId: number): Q.Promise<ReleaseInterfaces.ReleaseApproval>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseId
	    * @param {number} baseReleaseId
	    * @param {number} top
	    */
	    getReleaseChanges(project: string, releaseId: number, baseReleaseId?: number, top?: number): Q.Promise<ReleaseInterfaces.Change[]>;
	    /**
	    * @param {ReleaseInterfaces.ReleaseDefinition} releaseDefinition
	    * @param {string} project - Project ID or project name
	    */
	    createReleaseDefinition(releaseDefinition: ReleaseInterfaces.ReleaseDefinition, project: string): Q.Promise<ReleaseInterfaces.ReleaseDefinition>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} definitionId
	    */
	    deleteReleaseDefinition(project: string, definitionId: number): Q.Promise<void>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} definitionId
	    */
	    getReleaseDefinition(project: string, definitionId: number): Q.Promise<ReleaseInterfaces.ReleaseDefinition>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {string} searchText
	    * @param {number} artifactIdFilter
	    * @param {ReleaseInterfaces.ReleaseDefinitionExpands} expand
	    */
	    getReleaseDefinitions(project: string, searchText?: string, artifactIdFilter?: number, expand?: ReleaseInterfaces.ReleaseDefinitionExpands): Q.Promise<ReleaseInterfaces.ReleaseDefinition[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {string} artifactType
	    * @param {string} artifactSourceId
	    * @param {ReleaseInterfaces.ReleaseDefinitionExpands} expand
	    */
	    getReleaseDefinitionsForArtifactSource(project: string, artifactType: string, artifactSourceId: string, expand?: ReleaseInterfaces.ReleaseDefinitionExpands): Q.Promise<ReleaseInterfaces.ReleaseDefinition[]>;
	    /**
	    * @param {ReleaseInterfaces.ReleaseDefinition} releaseDefinition
	    * @param {string} project - Project ID or project name
	    */
	    updateReleaseDefinition(releaseDefinition: ReleaseInterfaces.ReleaseDefinition, project: string): Q.Promise<ReleaseInterfaces.ReleaseDefinition>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseId
	    * @param {number} environmentId
	    */
	    getReleaseEnvironment(project: string, releaseId: number, environmentId: number): Q.Promise<ReleaseInterfaces.ReleaseEnvironment>;
	    /**
	    * @param {any} environmentUpdateData
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseId
	    * @param {number} environmentId
	    */
	    updateReleaseEnvironment(environmentUpdateData: any, project: string, releaseId: number, environmentId: number): Q.Promise<ReleaseInterfaces.ReleaseEnvironment>;
	    /**
	    * @param {ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate} template
	    * @param {string} project - Project ID or project name
	    */
	    createDefinitionEnvironmentTemplate(template: ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate, project: string): Q.Promise<ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {string} templateId
	    */
	    deleteDefinitionEnvironmentTemplate(project: string, templateId: string): Q.Promise<void>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {string} templateId
	    */
	    getDefinitionEnvironmentTemplate(project: string, templateId: string): Q.Promise<ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate>;
	    /**
	    * @param {string} project - Project ID or project name
	    */
	    listDefinitionEnvironmentTemplates(project: string): Q.Promise<ReleaseInterfaces.ReleaseDefinitionEnvironmentTemplate[]>;
	    /**
	    * @param {FormInputInterfaces.InputValuesQuery} query
	    * @param {string} project - Project ID or project name
	    */
	    getInputValues(query: FormInputInterfaces.InputValuesQuery, project: string): Q.Promise<FormInputInterfaces.InputValuesQuery>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseId
	    */
	    getLogs(project: string, releaseId: number): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseId
	    * @param {number} environmentId
	    * @param {number} taskId
	    * @param {number} attemptId
	    */
	    getLog(project: string, releaseId: number, environmentId: number, taskId: number, attemptId?: number): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {ReleaseInterfaces.ReleaseStartMetadata} releaseStartMetadata
	    * @param {string} project - Project ID or project name
	    */
	    createRelease(releaseStartMetadata: ReleaseInterfaces.ReleaseStartMetadata, project: string): Q.Promise<ReleaseInterfaces.Release>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseId
	    */
	    deleteRelease(project: string, releaseId: number): Q.Promise<void>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseId
	    * @param {boolean} includeAllApprovals
	    */
	    getRelease(project: string, releaseId: number, includeAllApprovals?: boolean): Q.Promise<ReleaseInterfaces.Release>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} definitionId
	    * @param {number} releaseCount
	    * @param {boolean} includeArtifact
	    */
	    getReleaseDefinitionSummary(project: string, definitionId: number, releaseCount: number, includeArtifact?: boolean): Q.Promise<ReleaseInterfaces.ReleaseDefinitionSummary>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} definitionId
	    * @param {number} definitionEnvironmentId
	    * @param {string} searchText
	    * @param {string} createdBy
	    * @param {ReleaseInterfaces.ReleaseStatus} statusFilter
	    * @param {Date} minCreatedTime
	    * @param {Date} maxCreatedTime
	    * @param {ReleaseInterfaces.ReleaseQueryOrder} queryOrder
	    * @param {number} top
	    * @param {number} continuationToken
	    * @param {ReleaseInterfaces.ReleaseExpands} expand
	    * @param {string} artifactTypeId
	    * @param {number} artifactSourceId
	    * @param {string} artifactVersionId
	    */
	    getReleases(project: string, definitionId?: number, definitionEnvironmentId?: number, searchText?: string, createdBy?: string, statusFilter?: ReleaseInterfaces.ReleaseStatus, minCreatedTime?: Date, maxCreatedTime?: Date, queryOrder?: ReleaseInterfaces.ReleaseQueryOrder, top?: number, continuationToken?: number, expand?: ReleaseInterfaces.ReleaseExpands, artifactTypeId?: string, artifactSourceId?: number, artifactVersionId?: string): Q.Promise<ReleaseInterfaces.Release[]>;
	    /**
	    * @param {ReleaseInterfaces.Release} release
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseId
	    */
	    updateRelease(release: ReleaseInterfaces.Release, project: string, releaseId: number): Q.Promise<ReleaseInterfaces.Release>;
	    /**
	    * @param {ReleaseInterfaces.ReleaseUpdateMetadata} releaseUpdateMetadata
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseId
	    */
	    updateReleaseResource(releaseUpdateMetadata: ReleaseInterfaces.ReleaseUpdateMetadata, project: string, releaseId: number): Q.Promise<ReleaseInterfaces.Release>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} definitionId
	    */
	    getReleaseDefinitionHistory(project: string, definitionId: number): Q.Promise<ReleaseInterfaces.ReleaseDefinitionRevision[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} definitionId
	    * @param {number} revision
	    */
	    getReleaseDefinitionRevision(project: string, definitionId: number, revision: number): Q.Promise<NodeJS.ReadableStream>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {string} typeId
	    */
	    getArtifactsSources(project: string, typeId?: string): Q.Promise<ReleaseInterfaces.ArtifactSourceIdsQueryResult>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseId
	    * @param {number} environmentId
	    * @param {number} attemptId
	    */
	    getTasks(project: string, releaseId: number, environmentId: number, attemptId?: number): Q.Promise<ReleaseInterfaces.ReleaseTask[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    */
	    getArtifactTypeDefinitions(project: string): Q.Promise<ReleaseInterfaces.ArtifactTypeDefinition[]>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseDefinitionId
	    */
	    getArtifactVersions(project: string, releaseDefinitionId: number): Q.Promise<ReleaseInterfaces.ArtifactVersionQueryResult>;
	    /**
	    * @param {ReleaseInterfaces.Artifact[]} artifacts
	    * @param {string} project - Project ID or project name
	    */
	    getArtifactVersionsForSources(artifacts: ReleaseInterfaces.Artifact[], project: string): Q.Promise<ReleaseInterfaces.ArtifactVersionQueryResult>;
	    /**
	    * @param {string} project - Project ID or project name
	    * @param {number} releaseId
	    * @param {number} baseReleaseId
	    * @param {number} top
	    */
	    getReleaseWorkItemsRefs(project: string, releaseId: number, baseReleaseId?: number, top?: number): Q.Promise<ReleaseInterfaces.ReleaseWorkItemRef[]>;
	}

}
declare module 'vso-node-api/handlers/apiversion' {
	/// <reference path="../../node/node.d.ts" />
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	export class ApiVersionHandler implements VsoBaseInterfaces.IRequestHandler {
	    apiVersion: string;
	    constructor(apiVersion: string);
	    prepareRequest(options: any): void;
	    canHandleAuthentication(res: VsoBaseInterfaces.IHttpResponse): boolean;
	    handleAuthentication(httpClient: any, protocol: any, options: any, objs: any, finalCallback: any): void;
	}

}
declare module 'vso-node-api/handlers/basiccreds' {
	/// <reference path="../../node/node.d.ts" />
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	export class BasicCredentialHandler implements VsoBaseInterfaces.IRequestHandler {
	    username: string;
	    password: string;
	    constructor(username: string, password: string);
	    prepareRequest(options: any): void;
	    canHandleAuthentication(res: VsoBaseInterfaces.IHttpResponse): boolean;
	    handleAuthentication(httpClient: any, protocol: any, options: any, objs: any, finalCallback: any): void;
	}

}
declare module 'vso-node-api/handlers/bearertoken' {
	/// <reference path="../../node/node.d.ts" />
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	export class BearerCredentialHandler implements VsoBaseInterfaces.IRequestHandler {
	    token: string;
	    constructor(token: string);
	    prepareRequest(options: any): void;
	    canHandleAuthentication(res: VsoBaseInterfaces.IHttpResponse): boolean;
	    handleAuthentication(httpClient: any, protocol: any, options: any, objs: any, finalCallback: any): void;
	}

}
declare module 'vso-node-api/handlers/ntlm' {
	/// <reference path="../../node/node.d.ts" />
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	export class NtlmCredentialHandler implements VsoBaseInterfaces.IRequestHandler {
	    username: string;
	    password: string;
	    workstation: string;
	    domain: string;
	    constructor(username: string, password: string, domain?: string, workstation?: string);
	    prepareRequest(options: any): void;
	    canHandleAuthentication(res: VsoBaseInterfaces.IHttpResponse): boolean;
	    handleAuthentication(httpClient: any, protocol: any, options: any, objs: any, finalCallback: any): void;
	    private sendType1Message(httpClient, protocol, options, objs, keepaliveAgent, callback);
	    private sendType3Message(httpClient, protocol, options, objs, keepaliveAgent, res, callback);
	}

}
declare module 'vso-node-api/WebApi' {
	import VsoBaseInterfaces = require('vso-node-api/interfaces/common/VsoBaseInterfaces');
	import buildm = require('vso-node-api/BuildApi');
	import corem = require('vso-node-api/CoreApi');
	import filecontainerm = require('vso-node-api/FileContainerApi');
	import gallerym = require('vso-node-api/GalleryApi');
	import gitm = require('vso-node-api/GitApi');
	import taskagentm = require('vso-node-api/TaskAgentApi');
	import taskm = require('vso-node-api/TaskApi');
	import testm = require('vso-node-api/TestApi');
	import tfvcm = require('vso-node-api/TfvcApi');
	import workitemtrackingm = require('vso-node-api/WorkItemTrackingApi');
	import releasem = require('vso-node-api/ReleaseApi');
	import apivm = require('vso-node-api/handlers/apiversion');
	import basicm = require('vso-node-api/handlers/basiccreds');
	import bearm = require('vso-node-api/handlers/bearertoken');
	import ntlmm = require('vso-node-api/handlers/ntlm');
	/**
	 * Methods to return handler objects (see handlers folder)
	 */
	export function getVersionHandler(apiVersion: string): apivm.ApiVersionHandler;
	export function getBasicHandler(username: string, password: string): basicm.BasicCredentialHandler;
	export function getNtlmHandler(username: string, password: string, workstation?: string, domain?: string): ntlmm.NtlmCredentialHandler;
	export function getBearerHandler(token: any): bearm.BearerCredentialHandler;
	export class WebApi {
	    serverUrl: string;
	    authHandler: VsoBaseInterfaces.IRequestHandler;
	    constructor(serverUrl: string, authHandler: VsoBaseInterfaces.IRequestHandler);
	    /**
	     * Each factory method can take a serverUrl and a list of handlers
	     * if these aren't provided, the default url and auth handler given to the constructor for this class will be used
	     */
	    getBuildApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): buildm.IBuildApi;
	    /**
	     * Each API has a method here to create the "vanilla" API as well as one with a Q Promise wrapper.
	     */
	    getQBuildApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): buildm.IQBuildApi;
	    getCoreApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): corem.ICoreApi;
	    getQCoreApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): corem.IQCoreApi;
	    getFileContainerApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): filecontainerm.IFileContainerApi;
	    getQFileContainerApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): filecontainerm.IQFileContainerApi;
	    getGalleryApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): gallerym.IGalleryApi;
	    getQGalleryApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): gallerym.IQGalleryApi;
	    getGitApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): gitm.IGitApi;
	    getQGitApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): gitm.IQGitApi;
	    getTaskApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): taskm.ITaskApi;
	    getQTaskApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): taskm.IQTaskApi;
	    getTaskAgentApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): taskagentm.ITaskAgentApi;
	    getQTaskAgentApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): taskagentm.IQTaskAgentApi;
	    getTestApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): testm.ITestApi;
	    getQTestApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): testm.IQTestApi;
	    getTfvcApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): tfvcm.ITfvcApi;
	    getQTfvcApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): tfvcm.IQTfvcApi;
	    getWorkItemTrackingApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): workitemtrackingm.IWorkItemTrackingApi;
	    getQWorkItemTrackingApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): workitemtrackingm.IQWorkItemTrackingApi;
	    getReleaseApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): releasem.IReleaseApi;
	    getQReleaseApi(serverUrl?: string, handlers?: VsoBaseInterfaces.IRequestHandler[]): releasem.IQReleaseApi;
	}

}
