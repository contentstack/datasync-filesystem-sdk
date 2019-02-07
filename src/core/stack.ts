/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */

import * as fs from 'fs'
import { find, map, merge } from 'lodash'
import * as path from 'path'
import { defaultConfig } from './default'
import { Query } from './query'

export class Stack {
    public baseDir: any
    public masterLocale: any
    public config: any
    public content_type_uid: string
    public type: string
    public _query: any = {}
    public asset_uid: any
    public entry_uid: any
    public single: boolean = false
    public _entry: boolean =false;

    constructor(...stack_arguments) {
        this.baseDir
        this.masterLocale
        this.config = merge(defaultConfig, ...stack_arguments)
    }

    public connect(overrides: Object = {}) {
        this.config = merge(this.config, overrides)
        return new Promise((resolve, reject) => {
            try {
                if (!this.config['options'].hasOwnProperty('base_dir')) {
                    throw new Error('Please provide base_dir to connect the filesystem.')
                } else if (!this.config.hasOwnProperty('locales') || this.config.locales.length === 0) {
                    throw new Error('Please provide locales with code and relative_url_prefix.\n Example ==> locales:[{code:"en-us",relative_ul_prefix:"/"}].')
                } else if (!(fs.existsSync(this.config['options'].base_dir))) {
                    throw new Error(`${this.config['options'].base_dir} didn't exits.`)
                } else {
                    this.baseDir = this.config['options'].base_dir
                    this.masterLocale = this.config.locales[0].code
                    return resolve(this.config['options'])
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    public contentType(uid) {
        const stack = new Stack(this.config)
        stack.baseDir = this.baseDir
        stack.masterLocale = this.masterLocale
        if (!uid){
            throw new Error("Please provide valid uid")
        }
        else if (uid && typeof uid === 'string') {
            stack.content_type_uid = uid
            stack.type = 'contentType'
        }
        return stack
    }

    public entries() {
        const entry = new Query()
        this._entry= true
        if (this.type === undefined) {
            throw new Error("Please call contentType('uid') first")
        }
        return merge(entry, this)
    }

    public find() {
        const baseDir = this.baseDir
        const masterLocale = this.masterLocale
        const locale = (!this._query.locale) ? masterLocale : this._query.locale
        let result
        return new Promise((resolve, reject) => {
            if (this.type == 'asset') {
                const dataPath = path.join(baseDir, locale, 'assets', '_assets.json')
                if (!fs.existsSync(dataPath)) {
                    return reject(`asset not found`)
                } else {
                    fs.readFile(dataPath, 'utf8', (err, data) => {
                        if (err) {
                            return reject(err)
                        }
                        const finalResult = {}

                        if (!data) {
                            (finalResult as any).asset = null
                            return resolve(finalResult)
                        }
                        const assetData = JSON.parse(data)
                        if (!this.asset_uid) {
                            (finalResult as any).assets = []
                            return resolve(finalResult)
                        }
                        result = find(assetData, { uid: this.asset_uid });
                        (finalResult as any).asset = result
                        return resolve(finalResult)

                    })
                }

            } else if (this.type !== 'asset' && !this._entry) {
                const dataPath = path.join(baseDir, locale, 'data', this.content_type_uid, '_schema.json')
                if (!fs.existsSync(dataPath)) {
                    return reject(`content type not found`)
                }
                fs.readFile(dataPath, 'utf8', (err, data) => {
                    if (err) {
                        return reject(err)
                    }
                    const finalResult = {
                        content_type_uid: this.content_type_uid,
                    }
                    if (!data) {
                        return resolve((finalResult as any).content_type = null)
                    }
                    const schema = JSON.parse(data);
                    (finalResult as any).content_type = schema
                    return resolve(finalResult)
                })
            } else {
                const dataPath = path.join(baseDir, locale, 'data', this.content_type_uid, 'index.json')
                if (!fs.existsSync(dataPath)) {
                    return reject(`content type not found`)
                }
                fs.readFile(dataPath, 'utf8', (err, data) => {
                    if (err) {
                        return reject(err)
                    }
                    const finalResult = {
                        content_type_uid: this.content_type_uid,
                        locale,
                    }
                    if (!data) {
                        (finalResult as any).entry = null
                        return resolve(finalResult)
                    }
                    const entryData = JSON.parse(data)
                    result = map(entryData, 'data')

                    if (!this.entry_uid) {
                        (finalResult as any).entries = []
                        return resolve(finalResult)
                    }
                    result = find(result, { uid: this.entry_uid });
                    (finalResult as any).entry = result
                    return resolve(finalResult)
                })

            }
        })
    }

    public findOne() {
        this.single = true
        return new Promise((resolve, reject) => {
            this.find().then((result) => {
                return resolve(result)
            }).catch((error) => {
                return reject(error)
            })
        })
    }


    public entry(uid) {
        const entry = new Query()
        this._entry= true
        if (this.type === undefined) {
            throw new Error("Please call contentType('uid') first")
        }
        if (uid && typeof uid === 'string') {
            (entry as any).entry_uid = uid
        }
        return merge(this, entry)
    }


    public asset(uid) {
        this.type = 'asset'
        const asset = new Query()
        if (uid && typeof uid === 'string') {
            (asset as any).asset_uid = uid
        }
        return merge(this, asset)
    }

    public assets() {
        this.type = 'asset'
        const asset = new Query()
        return merge(asset, this)
    }

}
