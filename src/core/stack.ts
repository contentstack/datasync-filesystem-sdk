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
    public contentTypeUid: string
    public type: string
    public q: any = {}
    public assetUid: any
    public entryUid: any
    public single: boolean = false
    public isEntry: boolean = false

    constructor(...stackArguments) {
        this.config = merge(defaultConfig, ...stackArguments)
    }

    public connect(overrides: object = {}) {
        this.config = merge(this.config, overrides)
        return new Promise((resolve, reject) => {
            try {
                if (!this.config.contentStore.hasOwnProperty('baseDir')) {
                    throw new Error('Please provide baseDir to connect the filesystem.')
                } else if (!this.config.hasOwnProperty('locales') || this.config.locales.length === 0) {
                    throw new Error('Please provide locales with code and relative_url_prefix.')
                } else if (!(fs.existsSync(this.config.contentStore.baseDir))) {
                    console.log(fs.existsSync(this.config.contentStore.baseDir), path.resolve(this.config.contentStore.baseDir))
                    throw new Error(`${this.config.contentStore.baseDir} didn't exists.`)
                } else {
                    this.baseDir = this.config.contentStore.baseDir
                    this.masterLocale = this.config.locales[0].code

                    return resolve(this.config.contentStore)
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
        if (!uid) {
            throw new Error('Please provide valid uid')
        }else if (uid && typeof uid === 'string') {
            stack.contentTypeUid = uid
            stack.type = 'contentType'
        }

        return stack
    }

    public entries() {
        const entry = new Query()
        this.isEntry = true
        if (this.type === undefined) {
            throw new Error('Please call contentType(\'uid\') first')
        }

        return merge(entry, this)
    }

    public find() {
        const baseDir = this.baseDir
        const masterLocale = this.masterLocale
        const locale = (!this.q.locale) ? masterLocale : this.q.locale
        let result

        return new Promise((resolve, reject) => {
            if (this.type === 'asset') {
                const dataPath = path.join(baseDir, locale, 'assets', '_assets.json')
                if (!fs.existsSync(dataPath)) {

                    return reject('asset not found')
                }
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
                        if (!this.assetUid) {
                            (finalResult as any).assets = []

                            return resolve(finalResult)
                        }
                        result = find(assetData, { uid: this.assetUid });
                        (finalResult as any).asset = result

                        return resolve(finalResult)
                    })
            } else {
                const dataPath = path.join(baseDir, locale, 'data', this.contentTypeUid, 'index.json')
                if (!fs.existsSync(dataPath)) {

                    return reject('content type not found')
                }
                fs.readFile(dataPath, 'utf8', (err, data) => {
                    if (err) {

                        return reject(err)
                    }
                    const finalResult = {
                        content_type_uid: this.contentTypeUid,
                        locale,
                    }
                    if (!data) {
                        (finalResult as any).entry = null

                        return resolve(finalResult)
                    }
                    const entryData = JSON.parse(data)
                    result = map(entryData, 'data')

                    if (!this.entryUid) {
                        (finalResult as any).entries = []

                        return resolve(finalResult)
                    }
                    result = find(result, { uid: this.entryUid });
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


    public entry(uid?) {
        const entry = new Query()
        this.isEntry = true
        if (this.type === undefined) {
            throw new Error('Please call contentType(\'uid\') first')
        }
        if (uid && typeof uid === 'string') {
            (entry as any).entry_uid = uid

            return merge(this, entry)
        }
        this.single = true

        return merge(entry, this)
    }


    public asset(uid?) {
        this.type = 'asset'
        const asset = new Query()
        if (uid && typeof uid === 'string') {
            (asset as any).asset_uid = uid

            return merge(this, asset)
        }
        this.single = true

        return merge(asset, this)
    }

    public assets() {
        this.type = 'asset'
        const asset = new Query()

        return merge(asset, this)
    }

}
