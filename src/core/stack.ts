/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */

import * as fs from 'fs'
import {find, map, merge} from 'lodash'
import * as path from 'path'
import { defaultConfig  } from './default'
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
    public _entry: string
    public single: boolean = false

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
                } else if (!this.config.hasOwnProperty('locales') || this.config.locales.length == 0){
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
        if (uid && typeof uid === 'string') {
            stack.content_type_uid = uid
            stack.type = 'contentType'
        }
        return stack
    }

    public entries() {
        const entry = new Query()
        this._entry = 'multiple'
        if (this.type == undefined) {
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
                    return reject(`${dataPath} didn't exist`)
                } else {
                    fs.readFile(dataPath, 'utf8', (err, data) => {
                        if (err) {
                            return reject(err)
                        } else {
                          const finalResult = {}
                          let type = (this.asset_uid) ? 'asset' : 'assets'
                          
                          if (!data){
                            if (type == 'asset'){
                              finalResult[type] = null
                            }else{
                              finalResult[type] = []
                            }
                            return resolve(finalResult)
                           }
                          const assetData = JSON.parse(data)

                          if (this.asset_uid){
                                result = find(assetData, { uid: this.asset_uid })
                                finalResult[type] = result
                            }else{
                                result = assetData
                                finalResult[type] = result
                            }

                          if (this.single){
                              type = 'asset'
                              finalResult[type] = result[0]
                            }
                          resolve(finalResult)
                        }
                    })
                }

            }else if (this.type !== 'asset' && !this._entry){
              const dataPath = path.join(baseDir, locale, 'data', this.content_type_uid, '_schema.json')
              fs.readFile(dataPath, 'utf8', (err, data) => {
                if (err) {
                    return reject(err)
                } else {
                  const finalResult = {
                    content_type_uid: this.content_type_uid,
                  }
                  if (!data){
                   return resolve((finalResult as any).content_type = null)
                  }
                  const schema = JSON.parse(data);
                  (finalResult as any).content_type = schema
                  return resolve(finalResult)

                }
              })
            }else {

                const dataPath = path.join(baseDir, locale, 'data', this.content_type_uid, 'index.json')
                if (!fs.existsSync(dataPath)) {
                    return reject(`${dataPath} didn't exist`)
                } else {
                    fs.readFile(dataPath, 'utf8', (err, data) => {
                        if (err) {
                            return reject(err)
                        } else {
                          const finalResult = {
                            content_type_uid: this.content_type_uid,
                            locale,
                          }
                          let type = (this._entry == 'single') ? 'entry' : 'entries'
                          if (!data){
                            if (type == 'entry'){
                              finalResult[type] = null
                            }else{
                              finalResult[type] = []
                            }
                            return resolve(finalResult)
                           }
                          const entryData = JSON.parse(data)
                          result = map(entryData, 'data')

                          if (this._entry == 'single') {
                                result = find(result, { uid: this.entry_uid })
                                finalResult[type] = result
                                return resolve(finalResult)
                            }
                          if (this.single){
                              type = 'entry'
                              finalResult[type] = result[0]
                              return resolve(finalResult)
                            }
                          finalResult[type] = result
                          return resolve(finalResult)
                        }
                    })
                }
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
        if (this.type == undefined) {
            throw new Error("Please call contentType('uid') first")
        }
        if (uid && typeof uid === 'string') {
            (entry as any).entry_uid = uid
        }
        this._entry = 'single'
        return merge(this, entry)
    }


    public asset(uid) {
        this.type = 'asset'
        const asset = new Query()
        if (uid && typeof uid === 'string') {
            (asset as any).asset_uid = uid
            return merge(this, asset)
        }else{
            throw new Error('Please provide valid single asset uid')
        }
    }

    public assets() {
        this.type = 'asset'
        const asset = new Query()
        return merge(asset, this)
    }

}
