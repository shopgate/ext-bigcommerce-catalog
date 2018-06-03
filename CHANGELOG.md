# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- cache for BigCommerce requests

## [0.1.5] - 2018-05-16
### Changed
- product IDs are now exported in the format ${parentId}-${variantId}

### Fixed
- getCategory pipeline called getCategoryChildren pipeline still by its old (now invalid) name

## [0.1.4] - 2018-03-26
### Changed
- renamed pipelines according to new naming scheme

## [0.1.3] - 2018-02-07
### Added
- true support for async/await and JS promises in steps

## [0.1.2] - 2018-01-26
### Changed
- extension-config.json expects no longer a "backend" property in the configuration json

## [0.1.1] - 2018-01-22
### Added
- bigCommerce node wrapper to measure api call times

### Fixed
- corrected some JSDOCS

## [0.1.0] - 2018-01-04
### Added
- querying simple products for product list and product detail page
- querying categories for start page and category list

[Unreleased]: https://github.com/shopgate/cloud-ext-bigcommerce-catalog/compare/v0.1.5...HEAD
[0.1.5]: https://github.com/shopgate/cloud-ext-bigcommerce-catalog/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/shopgate/cloud-ext-bigcommerce-catalog/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/shopgate/cloud-ext-bigcommerce-catalog/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/shopgate/cloud-ext-bigcommerce-catalog/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/shopgate/cloud-ext-bigcommerce-catalog/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/shopgate/cloud-ext-bigcommerce-catalog/tree/v0.1.0
