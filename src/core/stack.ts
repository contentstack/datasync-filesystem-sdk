
import * as fs from 'fs'
import {merge, map, find} from 'lodash'
import * as path from 'path'
import { defaultConfig  } from './default'
import { Query } from './query'

let query = new Query()
export class Stack {
  baseDir: any
  masterLocale: any
  config: any
  content_type_uid: string
  type: string
  _query: any
  asset_uid: any
  entry_uid: any
  _entry: string

  constructor(...stack_arguments) {
    this.baseDir
    this.masterLocale
    this.config = merge(defaultConfig, ...stack_arguments)
  }

  public connect() {
    return new Promise((resolve, reject) => {
      try {
        if (!this.config['content-connector'].hasOwnProperty('base_dir')) {
          throw new Error('Please provide base_dir to connect the filesystem.')
        } else if (!this.config.hasOwnProperty('locales') || this.config.locales.length == 0) {
          throw new Error(
            'Please provide locales with code and relative_url_prefix.\n Example ==> locales:[{code:"en-us",relative_ul_prefix:"/"}].'
          )
        } else if (!(fs.existsSync(this.config['content-connector'].base_dir))) {
          throw new Error(`${this.config['content-connector'].base_dir} didn't exits.`)
        } else {
          this.baseDir = this.config['content-connector'].base_dir
          this.masterLocale = this.config.locales[0].code
          return resolve(this.config['content-connector'])
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  public contentType(uid) {
    if (this.baseDir == undefined) {
      throw new Error('Please call the Stack.connect() first')
    }
    if (uid && typeof uid === 'string') {
      this.content_type_uid = uid
      this.type = 'contentType'
    }
    return this
  }

  public entries(...val) {
    const entry = query
    this._entry = 'multiple'
    if (this.type == undefined) {
      throw new Error("Please call contentType('uid') first")
    }
    if (val.length > 0) {
      if (arguments.length) {
        for (let i = 0; i < arguments.length; i++) {
          entry['entry_uid'] = []
          entry['entry_uid'] = entry['entry_uid'].concat(arguments[i])
        }
      }
      return merge(this, entry)
    } else {
      return merge(this, entry)
    }
  }
  public find() {
    const baseDir = this.baseDir
    // TODO: remove master locale
    const masterLocale = this.masterLocale
    let result
    return new Promise((resolve, reject) => {
      // TODO: Use strict type/value checkings
      // TODO: Is it a good idea to create paths at runtime?
      // Bug: if there's a call for 'assets' with query, what will happen?
      if (this.type == 'asset') {
        const dataPath = (!this._query.locale) ? path.join(baseDir, masterLocale, 'assets', '_assets.json') :
          path.join(baseDir, this._query.locale, 'assets', '_assets.json')
        if (!fs.existsSync(dataPath)) {
          return reject(`${dataPath} didn't exist`)
        } else {
          fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
              return reject(err)
              // TODO: Avoid 'else' statements, where the code 'returns' in 'if' condition
            } else {
              const assetData = JSON.parse(data)
              const finalRes = {}
              if (this.asset_uid) {
                result = find(assetData, {
                  uid: this.asset_uid
                })
                finalRes['asset'] = result
              } else {
                result = assetData
                finalRes['assets'] = result
              }
              resolve(finalRes)
            }
          })
        }

      } else {
        const dataPath = (!this._query.locale) ? path.join(baseDir, masterLocale, 'data', this.content_type_uid,
          'index.json') : path.join(baseDir, this._query.locale, 'data', this.content_type_uid, 'index.json')
        if (!fs.existsSync(dataPath)) {
          return reject(`${dataPath} didn't exist`)
        } else {
          fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
              return reject(err)
            } else {
              // Bug: what would happen, if the data is empty?
              const entryData = JSON.parse(data)
              result = map(entryData, 'data')
              const finalRes = {
                content_type_uid: entryData[0].content_type_uid,
                locale: entryData[0].locale,
              }
              // if (this._query.includeReferences) {
              //   return this.includeReferencesI(result, this._query.locale, {}, undefined)
              //     .then(() => {
              //       if (this._entry === 'multiple') {
              //         (finalRes as any).entries = result
              //         return resolve(finalRes)
              //       }
              //       result = find(result, {
              //         uid: this.entry_uid
              //       })
              //       console.log(result, this.entry_uid, 'fgsfssj')
              //       finalRes.entry = result
              //       resolve(finalRes)
              //     })
              //     .catch(reject)
              // }
              // Question: Is 'this._entry=single/multiple' required?
              // Question: How to query only content type schemas?
              // TODO: Use object.property and avoid object['property'], if keys are static
              // TODO: Remove console.log
              if (this._entry == 'multiple') {
                finalRes['entries'] = result
                resolve(finalRes)
              } else if (this._entry == 'single') {
                result = find(result, {
                  uid: this.entry_uid
                })
                console.log(result, this.entry_uid, 'fgsfssj')
                finalRes['entry'] = result
                resolve(finalRes)
              }

            }
          })
        }
      }
    })


  }


  public entry(uid) {
    const entry = query
    if (this.type == undefined) {
      throw new Error("Please call contentType('uid') first")
    }
    if (uid && typeof uid === 'string') {
      entry['entry_uid'] = uid
    }
    this._entry = 'single'
    // console.log(Utils.merge(entry, this), "Utils.merge(entry, this)")
    return merge(this, entry)
  }


  public asset(uid) {
    this.type = 'asset'
    const asset = query
    if (uid && typeof uid === 'string') {
      asset['asset_uid'] = uid
      return merge(this, asset)

    } else {
      throw new Error('Please provide valid single asset uid')
    }

  }

  public assets() {
    this.type = 'asset'
    const asset = query
    return merge(this, asset)
  }


  public query() {
    if (typeof this._entry !== 'string' && this.type !== 'asset') {
      throw new Error('Please call the entries() before query()')
    }
    const _query = query
    return merge(_query, this)
  }

}

//module.exports = Stack
