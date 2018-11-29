import yaml from 'js-yaml'
import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'
import moment from 'moment'

function getYamlFrontMatterString(post) {
  let frontMatter = '---\r\n'
  frontMatter += yaml.safeDump({
    title: post.title,
    slug: post.slug,
    status: post.status,
    publishedDate: moment(post.published_at).toISOString(),
    metaDescription: post.meta_description,
    metaTitle: post.meta_title
  })
  frontMatter += '---\r\n'
  return frontMatter
}

function getMarkdownString(post) {
  return post.markdown
}

function saveGridsomePost(fileContent, path) {
  fs.writeFileSync(path, fileContent)
}

function ghostToGridsome(ghostExport, outputDir) {
  try {
    mkdirp.sync(outputDir)
    let ghostData = ghostExport.db[0].data
    let gridsomePosts = ghostData.posts.filter(
      p => p.page === 0 && p.page === 0 && p.status === 'published'
    )
    gridsomePosts.forEach(p => {
      let markdownString = getYamlFrontMatterString(p) + getMarkdownString(p)
      saveGridsomePost(markdownString, path.resolve(outputDir, p.slug + '.md'))
    })
    console.log('Successfully converted ' + gridsomePosts.length + ' posts')
  } catch (error) {
    console.error('ghostToGridsome encountered an error:')
    console.error(error)
  }
}

export default ghostToGridsome
