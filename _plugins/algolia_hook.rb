module Jekyll
  module Algolia
    module Hooks
      def self.before_indexing_each(record, node, context)
        if record[:no_list]
          return nil
        end
        [:anchor, :categories, :collection, :excerpt, :excerpt_text, :excerpt_html, :headings, :html, :last_modified_at, :slug, :type].each do |field|
          record.delete(field)
        end
        return record
      end
    end
  end
end
